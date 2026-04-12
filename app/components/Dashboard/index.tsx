"use client";
import React, { useState } from "react";
import { message } from "antd";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Share2, QrCode, Trash2, LinkIcon, AlertCircle, TrendingUp, Calendar, ChevronRight, BarChart2, Activity, LayoutDashboard, List, BarChart as BarChartIcon } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { useUrlShortener, useUrlHistory, useDeleteUrl, useCurrentUser } from "@/app/Services";
import { Flex, Typography, AnalyticsModal, Layout, Menu, Modal, Empty, ToolTip, Drawer, Button, ThemeToggle } from "@/app/components/common";
import { DASHBOARD_CONSTANTS, HERO_HEADING_DASHBOARD, HERO_SUBTEXT, SHORTEN, YOU_CAN_CREATE_MORE_LINKS, YOU_CAN_CREATE_MORE_LINKS_TOOLTIP } from "@/app/constants";

interface UrlItem {
  id: string;
  original_url: string;
  short_url: string;
  clicks: number;
  created_at: string;
}

export default function Dashboard() {
  const { data: historyData, refetch: refetchHistory } = useUrlHistory();
  const { data: user } = useCurrentUser();

  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  const [activeMenuItem, setActiveMenuItem] = useState<string>('overall');
  const [analyticsModalOpen, setAnalyticsModalOpen] = useState(false);
  const [selectedAnalyticsLink, setSelectedAnalyticsLink] = useState<UrlItem | null>(null);

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const [messageApi, contextHolder] = message.useMessage();

  const shortenerHandler = useUrlShortener({
    mutationConfig: {
      onSuccess: () => {
        refetchHistory();
        messageApi.success(DASHBOARD_CONSTANTS.MESSAGES.LINK_MINIMIZED_SUCCESS);
      },
      onError: (err: Error) => {
        messageApi.error(DASHBOARD_CONSTANTS.MESSAGES.LINK_MINIMIZED_ERROR);
        console.error("Shorten error:", err);
      },
    },
  });

  const deleteHandler = useDeleteUrl({
    mutationConfig: {
      onSuccess: () => {
        messageApi.success(DASHBOARD_CONSTANTS.MESSAGES.LINK_ERASED_SUCCESS);
        refetchHistory();
      },
      onError: (err: Error) => {
        messageApi.error(DASHBOARD_CONSTANTS.MESSAGES.LINK_ERASED_ERROR);
      },
    },
  });

  function handleShortenUrl(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const original_url = formData.get("original_url") as string;

    if (original_url) {
      shortenerHandler.mutate({
        data: {
          original_url,
        },
      });
      e.currentTarget.reset();
    }
  }

  const handleDelete = (shortCode: string) => {
    deleteHandler.mutate(shortCode);
  };

  const handleCopy = (shortCode: string) => {
    navigator.clipboard.writeText(shortCode).then(() => {
      messageApi.success(DASHBOARD_CONSTANTS.MESSAGES.LINK_COPIED_SUCCESS);
    });
  };

  const handleShare = async (record: UrlItem) => {
    const url = record.short_url;
    if (navigator.share) {
      try {
        await navigator.share({ url });
      } catch (err) { }
    } else {
      navigator.clipboard.writeText(url).then(() => {
        messageApi.info(DASHBOARD_CONSTANTS.MESSAGES.LINK_COPIED_FALLBACK);
      });
    }
  };

  const handleQrCode = (shortCode: string) => {
    setQrUrl(shortCode);
    setQrModalOpen(true);
  };

  const openAnalytics = (record: UrlItem) => {
    setSelectedAnalyticsLink(record);
    setAnalyticsModalOpen(true);
  };

  const urls: UrlItem[] = historyData?.data?.history || [];

  // Removed mock Math.random data. Now relies on pure API history data.
  // Note: Since history array only has global URL metrics, we group by creation date
  // to visualize activity instead of showing randomized clicks history.
  const timelineData = React.useMemo(() => {
    if (!urls || urls.length === 0) return [];
    
    const grouped = urls.reduce((acc, u) => {
      const date = new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      acc[date] = (acc[date] || 0) + u.clicks;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped).map(([name, clicks]) => ({ name, clicks }));
  }, [urls]);

  const barChartData = React.useMemo(() => {
     return urls.map(u => ({
         name: u.short_url.replace(/^https?:\/\//, ''),
         clicks: u.clicks,
         original: u.original_url
     })).sort((a, b) => b.clicks - a.clicks).slice(0, 5); 
  }, [urls]);

  const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);
  return (
    <Layout layoutProps={{ className: "min-h-screen font-body font-medium selection:bg-[var(--primary)] selection:text-[var(--foreground)]" }}>
      <Layout.Sider
        width={260}
        theme="light"
        className="!bg-[var(--background)] border-r-[4px] border-[var(--border-default)] [&_.ant-menu]:!bg-transparent hidden md:block"
        style={{ height: '100vh', position: 'sticky', top: 0, left: 0 }}
      >
        <div className="p-6">
           <Flex flexProps={{ align: "center", justify: "space-between" }}>
              <h2 className="font-heading font-black text-2xl m-0 tracking-tighter">jugaadlink.</h2>
              <ThemeToggle className="!p-2 -rotate-2" />
           </Flex>
        </div>
        <Menu
          menuProps={{
            mode: "inline",
            selectedKeys: [activeMenuItem],
            onClick: (e: any) => setActiveMenuItem(e.key),
            className: "!border-r-0 px-4 mt-8 [&_.ant-menu-item-selected]:!bg-[var(--primary)] [&_.ant-menu-item-selected]:!text-[var(--foreground)] [&_.ant-menu-item-selected]:!font-black hover:[&_.ant-menu-item]:!text-[var(--foreground)]",
            items: [
              {
                key: 'overall',
                icon: <LayoutDashboard size={20} className={activeMenuItem === 'overall' ? "stroke-[3px]" : ""} />,
                label: <span className="font-bold text-sm tracking-widest uppercase">{DASHBOARD_CONSTANTS.MENU.OVERALL_LINKS}</span>,
              },
              {
                key: 'history',
                icon: <List size={20} className={activeMenuItem === 'history' ? "stroke-[3px]" : ""} />,
                label: <span className="font-bold text-sm tracking-widest uppercase">{DASHBOARD_CONSTANTS.MENU.HISTORY_LOG}</span>,
              },
            ]
          }}
        />
      </Layout.Sider>
      
      {/* Wait, the Sider wrapper implementation simply aliases `AntdLayout.Sider`, so we don't change its props! but we DO change Layout.Content */}
      <Layout.Content className="bg-[var(--background)] text-[var(--foreground)] pt-16 pb-32 px-6 md:px-12 flex-1">
        {contextHolder}
      
      {/* Neo-brutalist QR Modal */}
      <Modal
        modalProps={{
          open: qrModalOpen,
          onCancel: () => setQrModalOpen(false),
          footer: null,
          centered: true,
          className: "neo-brutal-modal",
          rootClassName: "[&_.ant-modal-content]:!rounded-none [&_.ant-modal-content]:!border-[var(--border-width)] [&_.ant-modal-content]:!border-[var(--border-default)] [&_.ant-modal-content]:!shadow-[var(--shadow-solid)] [&_.ant-modal-content]:!p-0 [&_.ant-modal-content]:!bg-[var(--secondary)]"
        }}
      >
        <div className="bg-[var(--foreground)] text-[var(--secondary)] p-4 border-b-[var(--border-width)] border-[var(--border-default)]">
          <h3 className="font-heading font-black uppercase text-xl m-0 tracking-widest flex items-center gap-2">
            <QrCode /> {DASHBOARD_CONSTANTS.MODAL.QR_SCANNER}
          </h3>
        </div>
        <div className="flex flex-col items-center gap-6 py-12 px-6">
          <div className="p-4 bg-[var(--secondary)] border-[var(--border-width)] border-[var(--border-default)] shadow-[8px_8px_0_0_var(--primary)] transition-shadow hover:shadow-[4px_4px_0_0_var(--primary)]">
            {qrUrl && <QRCodeSVG value={qrUrl} size={240} level="H" fgColor="var(--foreground)" />}
          </div>
          <p className="font-bold border-b-2 border-[var(--foreground)] text-[var(--foreground)] px-2 py-1 break-all text-center mt-4">
            {qrUrl}
          </p>
        </div>
      </Modal>

      <div className="max-w-5xl mx-auto flex flex-col gap-16">
        
         {activeMenuItem === 'overall' && (
          <>
            {/* Simple & Minimal Header Block */}
            <div className="w-full">
           <h1 className="text-5xl md:text-7xl font-black font-heading tracking-tighter mb-4 text-[var(--foreground)]">
             {DASHBOARD_CONSTANTS.HERO.HEADING_LINE_1} <br className="hidden md:block" />{DASHBOARD_CONSTANTS.HERO.HEADING_LINE_2}
           </h1>
           <p className="text-[var(--foreground-subtle)] font-bold uppercase tracking-widest text-sm mb-12 flex items-center gap-2">
             <span className="w-8 h-[2px] bg-[var(--primary)] inline-block"></span> 
             {DASHBOARD_CONSTANTS.HERO.SUBTEXT}
           </p>

           <form onSubmit={handleShortenUrl} className="w-full flex flex-col md:flex-row items-end gap-6 relative">
             <div className="flex-grow w-full relative">
               <label className="text-xs font-black uppercase tracking-widest mb-2 block opacity-50">{DASHBOARD_CONSTANTS.FORM.LABEL}</label>
               <input
                 type="url"
                 name="original_url"
                 placeholder={DASHBOARD_CONSTANTS.FORM.PLACEHOLDER}
                 required
                 className="w-full bg-transparent border-b-[4px] border-[var(--border-default)] focus:border-[var(--primary)] text-2xl md:text-4xl font-bold py-2 focus:outline-none transition-colors placeholder:opacity-30"
               />
             </div>
             <Button
               buttonProps={{
                 htmlType: "submit",
                 disabled: shortenerHandler.isPending,
                 className: "!px-8 !py-8 !text-xl md:!text-2xl !bg-[var(--foreground)] !text-[var(--secondary)] hover:!bg-[var(--primary)] hover:!text-[var(--foreground)] !shadow-[6px_6px_0_0_var(--primary)]",
                 iconPosition: "end",
                 icon: <ChevronRight className="stroke-[3px]" />
               }}
             >
               {shortenerHandler.isPending ? DASHBOARD_CONSTANTS.FORM.BUTTON_LOADING : DASHBOARD_CONSTANTS.FORM.BUTTON_DEFAULT}
             </Button>
           </form>
           
           {!user && (
             <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-70">
               <AlertCircle size={14} className="text-[var(--primary)] stroke-[3px]" />
               {YOU_CAN_CREATE_MORE_LINKS}
             </div>
           )}
        </div>

        {/* Analytics Section */}
        {urls.length > 0 && (
          <Flex flexProps={{ vertical: true, gap: 32, className: "w-full" }}>
            <Flex flexProps={{ align: "center", gap: 12, className: "m-0" }}>
               <Typography typographyProps={{ level: 2, className: "!text-2xl !font-black !font-heading !m-0" }}>
                 {DASHBOARD_CONSTANTS.PERFORMANCE.HEADING}
               </Typography>
               <Activity className="text-[var(--primary)]" />
            </Flex>
            
            {/* Top Stat Cards */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Flex flexProps={{ vertical: true, gap: 8, className: "neo-brutal p-6" }}>
                <Typography typographyProps={{ level: 5, className: "!text-xs !font-bold !uppercase !tracking-widest !opacity-70 !m-0" }}>{DASHBOARD_CONSTANTS.PERFORMANCE.OVERALL_CLICKS}</Typography>
                <Typography typographyProps={{ level: 2, className: "!text-5xl !font-black !m-0" }}>{totalClicks}</Typography>
              </Flex>
              <Flex flexProps={{ vertical: true, gap: 8, className: "neo-brutal p-6" }}>
                <Typography typographyProps={{ level: 5, className: "!text-xs !font-bold !uppercase !tracking-widest !opacity-70 !m-0" }}>{DASHBOARD_CONSTANTS.PERFORMANCE.ACTIVE_LINKS}</Typography>
                <Typography typographyProps={{ level: 2, className: "!text-5xl !font-black !m-0" }}>{urls.length}</Typography>
              </Flex>
              <Flex flexProps={{ vertical: true, gap: 8, className: "neo-brutal p-6 bg-[var(--primary)] text-[var(--foreground)]" }}>
                <Typography typographyProps={{ level: 5, className: "!text-xs !font-bold !uppercase !tracking-widest !opacity-70 !m-0" }}>{DASHBOARD_CONSTANTS.PERFORMANCE.AVG_CLICKS}</Typography>
                <Typography typographyProps={{ level: 2, className: "!text-5xl !font-black !m-0" }}>
                  {urls.length ? (totalClicks / urls.length).toFixed(1) : 0}
                </Typography>
              </Flex>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full h-[400px]">
              
              {/* Line Chart */}
              <Flex flexProps={{ vertical: true, className: "w-full h-full neo-brutal p-6 bg-[var(--secondary)]" }}>
                <Flex flexProps={{ align: "center", gap: 8, className: "mb-6" }}>
                  <TrendingUp size={16}/> 
                  <Typography typographyProps={{ level: 5, className: "!text-sm !font-black !uppercase !tracking-widest !m-0" }}>
                    {DASHBOARD_CONSTANTS.PERFORMANCE.TRAFFIC_FORECAST}
                  </Typography>
                </Flex>
                <div className="flex-grow w-full">
                  {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timelineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                      <XAxis dataKey="name" stroke="var(--chart-text)" tick={{ fill: 'var(--chart-text)', fontWeight: 'bold', fontSize: 12 }} />
                      <YAxis stroke="var(--chart-text)" tick={{ fill: 'var(--chart-text)', fontWeight: 'bold', fontSize: 12 }} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: 'var(--chart-tooltip-bg)', color: 'var(--chart-tooltip-text)', border: 'none', borderRadius: '0', fontWeight: 'bold' }}
                        itemStyle={{ color: 'var(--primary)' }}
                      />
                      <Line type="monotone" dataKey="clicks" stroke="var(--chart-line)" strokeWidth={4} dot={{ strokeWidth: 2, r: 4, fill: 'var(--chart-line)' }} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                  )}
                </div>
              </Flex>

              {/* Bar Chart */}
              <Flex flexProps={{ vertical: true, className: "w-full h-full neo-brutal p-6 bg-[var(--secondary)]" }}>
                <Flex flexProps={{ align: "center", gap: 8, className: "mb-6" }}>
                  <BarChart2 size={16}/> 
                  <Typography typographyProps={{ level: 5, className: "!text-sm !font-black !uppercase !tracking-widest !m-0" }}>
                    {DASHBOARD_CONSTANTS.PERFORMANCE.TOP_PERFORMING}
                  </Typography>
                </Flex>
                <div className="flex-grow w-full">
                  {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData} layout="vertical" margin={{ top: 0, right: 0, bottom: 0, left: 60 }}>
                      <XAxis type="number" stroke="var(--chart-text)" tick={{ fill: 'var(--chart-text)', fontWeight: 'bold', fontSize: 12 }} />
                      <YAxis type="category" dataKey="name" stroke="var(--chart-text)" tick={{ fill: 'var(--chart-text)', fontWeight: 'bold', fontSize: 12 }} width={80} tickFormatter={(value) => value.substring(0, 10) + '...'} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: 'var(--chart-tooltip-bg)', color: 'var(--chart-tooltip-text)', border: 'none', borderRadius: '0', fontWeight: 'bold' }}
                        cursor={{ fill: 'rgba(var(--foreground-rgb), 0.05)' }}
                      />
                      <Bar dataKey="clicks" fill="var(--chart-bar)" stroke="var(--border-default)" strokeWidth={2} radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  )}
                </div>
              </Flex>

            </div>
          </Flex>
        )}
        </>
        )}

        {activeMenuItem === 'history' && (
          <div className="w-full">
            {/* Clean Creative History "Table" */}
              <Flex flexProps={{ justify: "space-between", align: "center", className: "mb-8" }}>
               <Flex flexProps={{ align: "center", gap: 12, className: "m-0" }}>
                  <Typography typographyProps={{ level: 2, className: "!text-2xl !font-black !font-heading !m-0" }}>
                    {DASHBOARD_CONSTANTS.HISTORY.HEADING}
                  </Typography>
                  <span className="bg-[var(--primary)] w-3 h-3 rounded-full inline-block animate-pulse"></span>
               </Flex>
               <div className="text-xs font-bold uppercase tracking-widest border border-[var(--foreground)] px-3 py-1 bg-[var(--secondary)]">
                 {urls.length} {DASHBOARD_CONSTANTS.HISTORY.TOTAL_LINKS}
               </div>
             </Flex>
           
           {urls.length === 0 ? (
             <Flex flexProps={{ vertical: true, align: "center", justify: "center", className: "w-full border-2 border-[var(--border-default)] p-16 bg-[var(--background-muted)] border-dashed" }}>
                 <LinkIcon size={48} className="opacity-20 mb-4" />
                 <Typography typographyProps={{ level: 5, className: "!font-bold !text-center !opacity-50 !uppercase !tracking-widest" }}>{DASHBOARD_CONSTANTS.HISTORY.NO_LINKS}</Typography>
             </Flex>
           ) : (
             <div className="flex flex-col gap-4">
               {/* Hidden Headers for screen readers, visually implied by columns */}
               <div className="hidden lg:grid grid-cols-12 gap-6 px-6 py-2 text-xs font-black uppercase tracking-widest text-[var(--foreground-subtle)] border-b-2 border-[var(--border-default)] mb-4">
                  <div className="col-span-5">{DASHBOARD_CONSTANTS.HISTORY.HEADER_SOURCE_TARGET}</div>
                  <div className="col-span-2 text-center">{DASHBOARD_CONSTANTS.HISTORY.HEADER_ANALYTICS}</div>
                  <div className="col-span-2 text-center">{DASHBOARD_CONSTANTS.HISTORY.HEADER_CREATED}</div>
                  <div className="col-span-3 text-right">{DASHBOARD_CONSTANTS.HISTORY.HEADER_OPERATIONS}</div>
               </div>

               {/* Creative Rows */}
               {urls.map((record) => (
                 <div key={record.id} className="group grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-[var(--secondary)] border-[var(--border-width)] border-[var(--border-default)] p-6 transition-all hover:shadow-[6px_6px_0_0_var(--foreground)] hover:-translate-y-1 relative overflow-hidden">
                    
                    {/* Left Colored Accent Strip on Hover */}
                    <div className="absolute left-0 top-0 bottom-0 w-2 bg-[var(--primary)] -translate-x-full group-hover:translate-x-0 transition-transform"></div>
                    
                    {/* Source & Target URLs */}
                    <div className="lg:col-span-5 flex flex-col gap-2 overflow-hidden pl-2">
                       <a href={record.short_url} target="_blank" rel="noreferrer" className="text-2xl font-black text-[var(--primary)] hover:text-[var(--foreground)] transition-colors truncate">
                         {record.short_url.replace(/^https?:\/\//, '')}
                       </a>
                       <a href={record.original_url} target="_blank" rel="noreferrer" className="text-sm font-bold text-[var(--foreground-subtle)] hover:text-[var(--foreground)] transition-colors truncate opacity-70 hover:opacity-100 flex items-center gap-1">
                         <LinkIcon size={12} className="flex-shrink-0"/> {record.original_url}
                       </a>
                    </div>

                    {/* Analytics / Clicks */}
                    <div className="lg:col-span-2 flex justify-start lg:justify-center items-center">
                       <div className="flex items-center gap-2 bg-[var(--background-muted)] px-3 py-1 font-black text-xl border-[var(--border-width)] border-transparent group-hover:border-[var(--foreground)] transition-colors">
                          <TrendingUp size={16} className="text-[var(--primary)]" />
                          {record.clicks}
                       </div>
                    </div>

                    {/* Date */}
                    <div className="lg:col-span-2 flex justify-start lg:justify-center items-center text-xs font-bold uppercase text-[var(--foreground-subtle)] tracking-widest gap-2">
                       <Calendar size={14} className="opacity-50" />
                       {new Date(record.created_at).toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' })}
                    </div>

                    {/* Actions */}
                    <div className="lg:col-span-3 flex justify-start lg:justify-end items-center gap-2 mt-4 lg:mt-0">
                      <ToolTip tooltipProps={{ title: DASHBOARD_CONSTANTS.HISTORY.TOOLTIP_ANALYTICS }}>
                        <Button buttonProps={{ onClick: () => openAnalytics(record), icon: <BarChartIcon size={18} />, type: "text", shape: "circle", className: "hover:!bg-[var(--primary)]" }} />
                      </ToolTip>
                      <ToolTip tooltipProps={{ title: DASHBOARD_CONSTANTS.HISTORY.TOOLTIP_COPY }}>
                        <Button buttonProps={{ onClick: () => handleCopy(record.short_url), icon: <Copy size={18} />, type: "text", shape: "circle", className: "hover:!bg-[var(--primary)]" }} />
                      </ToolTip>
                      <ToolTip tooltipProps={{ title: DASHBOARD_CONSTANTS.HISTORY.TOOLTIP_QR }}>
                        <Button buttonProps={{ onClick: () => handleQrCode(record.short_url), icon: <QrCode size={18} />, type: "text", shape: "circle", className: "hover:!bg-[var(--primary)]" }} />
                      </ToolTip>
                      <ToolTip tooltipProps={{ title: DASHBOARD_CONSTANTS.HISTORY.TOOLTIP_SHARE }}>
                        <Button buttonProps={{ onClick: () => handleShare(record), icon: <Share2 size={18} />, type: "text", shape: "circle", className: "hover:!bg-[var(--primary)]" }} />
                      </ToolTip>
                      <ToolTip tooltipProps={{ title: DASHBOARD_CONSTANTS.HISTORY.TOOLTIP_DELETE }}>
                        <Button buttonProps={{ onClick: () => handleDelete(record.short_url), icon: <Trash2 size={18} />, type: "text", shape: "circle", danger: true }} />
                      </ToolTip>
                    </div>
                 </div>
               ))}
             </div>
           )}
        </div>
        )}

      </div>
      
      {/* Analytics Modal Component */}
      <AnalyticsModal
        open={analyticsModalOpen}
        onClose={() => setAnalyticsModalOpen(false)}
        selectedLink={selectedAnalyticsLink}
        onCopy={handleCopy}
        onQrCode={handleQrCode}
        onShare={handleShare}
        onDelete={handleDelete}
      />

      </Layout.Content>
    </Layout>
  );
}
