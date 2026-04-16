"use client";
import React, { useState, useCallback } from "react";
import { message, DatePicker, InputNumber, Switch } from "antd";
import { QRCodeSVG } from "qrcode.react";
import { 
  Copy, Share2, QrCode, Trash2, LinkIcon, AlertCircle, TrendingUp, Calendar, 
  ChevronRight, BarChart2, Activity, LayoutDashboard, List, 
  BarChart as BarChartIcon, Settings, Lock, Clock, Info, ChevronDown, ChevronUp,
  Zap, Globe,
  ArrowUpRight
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, 
  LineChart, Line, CartesianGrid 
} from "recharts";
import { 
  useUrlShortener, useUrlHistory, useDeleteUrl, useCurrentUser, useLinkPreview, UrlItem 
} from "@/app/Services";
import { 
  Flex, Typography, AnalyticsModal, Layout, Menu, Modal, Empty, ToolTip, 
  Button, ThemeToggle, Card, Input 
} from "@/app/components/common";
import { DASHBOARD_CONSTANTS, YOU_CAN_CREATE_MORE_LINKS } from "@/app/constants";

export default function Dashboard() {
  const { data: historyData, refetch: refetchHistory } = useUrlHistory();
  const { data: user } = useCurrentUser();

  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState<string>('overall');
  const [analyticsModalOpen, setAnalyticsModalOpen] = useState(false);
  const [selectedAnalyticsLink, setSelectedAnalyticsLink] = useState<UrlItem | null>(null);
  const [mounted, setMounted] = React.useState(false);

  // Advanced Form State
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [password, setPassword] = useState("");
  const [maxClicks, setMaxClicks] = useState<number | undefined>(undefined);
  const [expiryDate, setExpiryDate] = useState<string | undefined>(undefined);
  const [urlInput, setUrlInput] = useState("");
  const [previewData, setPreviewData] = useState<any>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const [messageApi, contextHolder] = message.useMessage();

  const shortenerHandler = useUrlShortener({
    mutationConfig: {
      onSuccess: () => {
        refetchHistory();
        messageApi.success(DASHBOARD_CONSTANTS.MESSAGES.LINK_MINIMIZED_SUCCESS);
        resetForm();
      },
      onError: (err: Error) => {
        messageApi.error(DASHBOARD_CONSTANTS.MESSAGES.LINK_MINIMIZED_ERROR);
      },
    },
  });

  const previewHandler = useLinkPreview({
    mutationConfig: {
      onSuccess: (res: any) => {
        setPreviewData(res?.data);
      },
      onError: () => {
        setPreviewData(null);
      }
    }
  });

  const resetForm = () => {
    setUrlInput("");
    setPassword("");
    setMaxClicks(undefined);
    setExpiryDate(undefined);
    setPreviewData(null);
    setShowAdvanced(false);
    setLastProcessedUrl("");
  };

  const deleteHandler = useDeleteUrl({
    mutationConfig: {
      onSuccess: () => {
        messageApi.success(DASHBOARD_CONSTANTS.MESSAGES.LINK_ERASED_SUCCESS);
        refetchHistory();
      },
      onError: () => messageApi.error(DASHBOARD_CONSTANTS.MESSAGES.LINK_ERASED_ERROR),
    },
  });

  const [lastProcessedUrl, setLastProcessedUrl] = useState("");

  React.useEffect(() => {
    if (!urlInput || urlInput.length <= 5 || urlInput === lastProcessedUrl) return;

    const timer = setTimeout(() => {
      previewHandler.mutate(urlInput);
      setLastProcessedUrl(urlInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [urlInput]); // Only depend on urlInput

  function handleShortenUrl(e: React.FormEvent) {
    e.preventDefault();
    if (urlInput) {
      shortenerHandler.mutate({
        data: {
          original_url: urlInput,
          password: password || undefined,
          max_clicks: maxClicks,
          expires_at: expiryDate,
        },
      });
    }
  }

  const handleDelete = (shortCode: string) => deleteHandler.mutate(shortCode);
  const handleCopy = (shortCode: string) => {
    navigator.clipboard.writeText(shortCode).then(() => {
      messageApi.success(DASHBOARD_CONSTANTS.MESSAGES.LINK_COPIED_SUCCESS);
    });
  };

  const handleShare = async (record: UrlItem) => {
    const url = record.short_url;
    if (navigator.share) {
      try { await navigator.share({ url }); } catch (err) { }
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
    <Layout className="min-h-screen bg-[var(--background)] selection:bg-[var(--primary)] selection:text-white overflow-hidden">
      {contextHolder}
      <Layout.Sider
        width={280}
        className="!bg-[var(--background-subtle)] border-r border-[var(--border-default)] hidden lg:block"
        style={{ height: '100vh', position: 'sticky', top: 0, left: 0 }}
      >
        <div className="p-8">
           <Flex align="center" justify="space-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center text-white font-bold">J</div>
                <h2 className="font-heading font-extrabold text-xl m-0 tracking-tight">jugaadlink.</h2>
              </div>
           </Flex>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[activeMenuItem]}
          onClick={(e: any) => setActiveMenuItem(e.key)}
          className="!border-r-0 px-4 mt-4 [&_.ant-menu-item]:!rounded-xl [&_.ant-menu-item-selected]:!bg-[var(--primary)] [&_.ant-menu-item-selected]:!text-white [&_.ant-menu-item-selected]:!shadow-md transition-all"
          items={[
            {
              key: 'overall',
              icon: <LayoutDashboard size={20} />,
              label: <span className="font-semibold">{DASHBOARD_CONSTANTS.MENU.OVERALL_LINKS}</span>,
            },
            {
              key: 'history',
              icon: <List size={20} />,
              label: <span className="font-semibold lowercase first-letter:uppercase">{DASHBOARD_CONSTANTS.MENU.HISTORY_LOG}</span>,
            },
          ]}
        />
        <div className="absolute bottom-8 left-0 w-full px-8">
           <div className="p-4 rounded-2xl bg-[var(--background-muted)] border border-[var(--border-default)]">
              <Flex align="center" gap={12}>
                <ThemeToggle className="!p-2 !rounded-lg !bg-white !shadow-sm" />
                <div>
                   <p className="text-xs font-bold opacity-50 m-0">Theme</p>
                   <p className="text-sm font-bold m-0 text-slate-400">Appearance</p>
                </div>
              </Flex>
           </div>
        </div>
      </Layout.Sider>
      
      <Layout.Content className="pt-8 pb-32 px-6 md:px-12 flex-1 max-w-7xl mx-auto w-full">
        
        {/* QR Modal - Premium Styling */}
        <Modal
          open={qrModalOpen}
          onCancel={() => setQrModalOpen(false)}
          footer={null}
          centered
          className="premium-modal"
        >
          <div className="p-8 flex flex-col items-center gap-8">
            <Typography.Title level={3} className="!font-extrabold !text-center !m-0">
               {DASHBOARD_CONSTANTS.MODAL.QR_SCANNER}
            </Typography.Title>
            <div className="p-6 bg-white rounded-3xl shadow-xl border border-slate-100">
               {qrUrl && <QRCodeSVG value={qrUrl} size={240} level="H" fgColor="#0F172A" />}
            </div>
            <div className="w-full p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
               <span className="text-slate-500 font-mono text-xs break-all">{qrUrl}</span>
            </div>
            <Button block size="large" type="primary" onClick={() => handleCopy(qrUrl || "")}>
               Copy Link
            </Button>
          </div>
        </Modal>

        {activeMenuItem === 'overall' && (
          <div className="animate-premium">
             <div className="max-w-4xl">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary-subtle)] text-[var(--primary)] text-xs font-bold uppercase tracking-wider mb-6 border border-[var(--primary-subtle)]">
                   <Zap size={14} /> New Era of Shortening
                </span>
                <h1 className="text-5xl md:text-7xl font-black font-heading tracking-tight mb-6 text-[var(--foreground)] leading-[1.05]">
                  {DASHBOARD_CONSTANTS.HERO.HEADING_LINE_1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-indigo-400">{DASHBOARD_CONSTANTS.HERO.HEADING_LINE_2}</span>
                </h1>
                <p className="text-[var(--foreground-muted)] font-medium text-xl leading-relaxed max-w-2xl opacity-90">
                  {DASHBOARD_CONSTANTS.HERO.SUBTEXT}
                </p>
             </div>

            {/* Shortener Tool - Main Premium Container */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 mt-12 mb-20">
              <div className="xl:col-span-2">
                <Card className="premium-card !p-8 border-none ring-1 ring-slate-200">
                  <form onSubmit={handleShortenUrl} className="flex flex-col gap-6">
                    <div className="relative group">
                       <input
                          type="text"
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          placeholder={DASHBOARD_CONSTANTS.FORM.PLACEHOLDER}
                          required
                          className="w-full bg-slate-50 border border-slate-200 focus:border-[var(--primary)] focus:ring-4 focus:ring-indigo-50 text-xl font-bold p-6 rounded-2xl outline-none transition-all placeholder:text-slate-300"
                       />
                       <Button
                          htmlType="submit"
                          loading={shortenerHandler.isPending}
                          className="!absolute !right-3 !top-3 !bottom-3 !h-auto !px-8 !rounded-xl !bg-[var(--primary)] !text-white !font-bold !text-lg !shadow-lg !shadow-indigo-200"
                       >
                         {DASHBOARD_CONSTANTS.FORM.BUTTON_DEFAULT}
                       </Button>
                    </div>

                    {/* Advanced Toggle */}
                    <div className="flex justify-between items-center">
                       <button 
                          type="button"
                          onClick={() => setShowAdvanced(!showAdvanced)}
                          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors"
                       >
                          <Settings size={16} className={showAdvanced ? "animate-spin-slow" : ""} />
                          {DASHBOARD_CONSTANTS.FORM.ADVANCED_OPTIONS}
                          {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                       </button>
                       {!user && (
                         <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            <Info size={14} className="text-amber-500" />
                            {YOU_CAN_CREATE_MORE_LINKS}
                         </div>
                       )}
                    </div>

                    {/* Advanced Section */}
                    {showAdvanced && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
                         <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1">
                               <Lock size={12} /> {DASHBOARD_CONSTANTS.FORM.PASSWORD}
                            </label>
                             <Input 
                                type="password"
                                placeholder="Optional password"
                                value={password}
                                onChange={(e: any) => setPassword(e.target.value)}
                                className="!border-slate-200 !bg-white"
                             />
                         </div>
                         <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1">
                               <Activity size={12} /> {DASHBOARD_CONSTANTS.FORM.MAX_CLICKS}
                            </label>
                            <InputNumber 
                               min={1}
                               placeholder="Unlimited"
                               value={maxClicks}
                               onChange={(val) => setMaxClicks(val || undefined)}
                               className="!w-full !rounded-md !border-slate-200 !py-1"
                            />
                         </div>
                         <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1">
                               <Clock size={12} /> {DASHBOARD_CONSTANTS.FORM.EXPIRY_DATE}
                            </label>
                            <DatePicker 
                               showTime
                               placeholder="Set expiry"
                               onChange={(date, dateString) => setExpiryDate(date ? date.toISOString() : undefined)}
                               className="!w-full !rounded-md !border-slate-200 !py-2"
                            />
                         </div>
                      </div>
                    )}
                  </form>
                </Card>
              </div>

              {/* Link Preview Card */}
              <div className="xl:col-span-1">
                 <div className="h-full">
                    {previewData ? (
                      <Card className="premium-card !p-0 border-none overflow-hidden h-full flex flex-col animate-in slide-in-from-right-4 duration-300">
                         <div className="aspect-video w-full bg-slate-100 relative overflow-hidden">
                            {previewData.image ? (
                              <img src={previewData.image} alt="preview" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center opacity-10">
                                 <Globe size={80} />
                              </div>
                            )}
                            <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur rounded-md text-[9px] font-black uppercase shadow-sm">
                               {DASHBOARD_CONSTANTS.FORM.PREVIEW_TITLE}
                            </div>
                         </div>
                         <div className="p-5 flex flex-col justify-between flex-grow">
                            <div>
                               <h4 className="font-bold text-sm mb-1 line-clamp-2">{previewData.title || "Untitled Page"}</h4>
                               <p className="text-xs text-slate-500 line-clamp-2">{previewData.description || "No description available for this link."}</p>
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                               <span className="text-[10px] font-mono text-indigo-500 font-bold max-w-[150px] truncate">{urlInput}</span>
                               <Globe size={14} className="text-slate-300" />
                            </div>
                         </div>
                      </Card>
                    ) : (
                      <div className="h-full border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-8 text-center text-slate-400 opacity-60">
                         <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                            <ArrowUpRight size={24} />
                         </div>
                         <p className="text-xs font-bold leading-relaxed">
                            {previewHandler.isPending ? "Analysing link profile..." : "Enter a URL to see a live <br/> link preview card here"}
                         </p>
                      </div>
                    )}
                 </div>
              </div>
            </div>

            {/* Performance Snapshot */}
            {urls.length > 0 && (
              <div className="flex flex-col gap-10">
                <Flex align="center" justify="space-between">
                   <div className="flex flex-col">
                      <Typography.Title level={2} className="!font-black !tracking-tight !m-0 !text-3xl">
                        {DASHBOARD_CONSTANTS.PERFORMANCE.HEADING}
                      </Typography.Title>
                      <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest mt-1">Global ecosystem overview</span>
                   </div>
                   <Activity className="text-indigo-600" />
                </Flex>

                {/* Stats Overview Grid - Premium Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-premium" style={{ animationDelay: '0.2s' }}>
                   {[
                     { label: DASHBOARD_CONSTANTS.PERFORMANCE.OVERALL_CLICKS, val: totalClicks, ico: <BarChartIcon size={20} />, col: "emerald" },
                     { label: DASHBOARD_CONSTANTS.PERFORMANCE.ACTIVE_LINKS, val: urls.length, ico: <LinkIcon size={20} />, col: "indigo" },
                     { label: DASHBOARD_CONSTANTS.PERFORMANCE.AVG_CLICKS, val: urls.length ? (totalClicks / urls.length).toFixed(1) : 0, ico: <Zap size={20} />, col: "amber" },
                     { label: DASHBOARD_CONSTANTS.PERFORMANCE.LAST_7_DAYS, val: urls.filter(u => new Date(u.created_at) > new Date(Date.now() - 7*24*60*60*1000)).length, ico: <TrendingUp size={20} />, col: "rose" }
                   ].map((stat, i) => (
                     <div key={i} className="premium-card !p-6 flex flex-col gap-4 group">
                        <div className="flex items-center justify-between">
                           <div className={`p-3 rounded-xl bg-${stat.col}-50 text-${stat.col}-600 group-hover:scale-110 transition-transform`}>
                              {stat.ico}
                           </div>
                           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground-subtle)] opacity-50">Pulse</span>
                        </div>
                        <div>
                           <Typography.Title level={2} className="!text-3xl !font-black !m-0 !tracking-tight">
                             {stat.val}
                           </Typography.Title>
                           <p className="text-[11px] font-bold text-[var(--foreground-muted)] uppercase tracking-wider mt-1">{stat.label}</p>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[400px]">
                  <Card className="premium-card !p-8 border-none ring-1 ring-slate-200">
                    <Typography.Text className="!text-xs !font-black !uppercase !tracking-widest !mb-8 !flex !items-center !gap-2">
                      <Calendar size={14}/> {DASHBOARD_CONSTANTS.PERFORMANCE.TRAFFIC_FORECAST}
                    </Typography.Text>
                    <div className="w-full h-[260px]">
                       {mounted && (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={timelineData}>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#F1F5F9" />
                            <XAxis 
                               dataKey="name" 
                               axisLine={false} 
                               tickLine={false} 
                               tick={{ fill: '#94A3B8', fontWeight: 600, fontSize: 10 }} 
                               dy={10}
                            />
                            <YAxis 
                               axisLine={false} 
                               tickLine={false} 
                               tick={{ fill: '#94A3B8', fontWeight: 600, fontSize: 10 }} 
                            />
                            <RechartsTooltip 
                              contentStyle={{ 
                                backgroundColor: '#FFF', 
                                border: '1px solid #F1F5F9', 
                                borderRadius: '12px', 
                                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                                fontSize: '12px'
                              }}
                            />
                            <Line 
                               type="monotone" 
                               dataKey="clicks" 
                               stroke="var(--primary)" 
                               strokeWidth={4} 
                               dot={false}
                               activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--primary)' }} 
                            />
                          </LineChart>
                        </ResponsiveContainer>
                       )}
                    </div>
                  </Card>

                  <Card className="premium-card !p-8 border-none ring-1 ring-slate-200">
                    <Typography.Text className="!text-xs !font-black !uppercase !tracking-widest !mb-8 !flex !items-center !gap-2">
                      <BarChart2 size={14}/> {DASHBOARD_CONSTANTS.PERFORMANCE.TOP_PERFORMING}
                    </Typography.Text>
                    <div className="w-full h-[260px]">
                       {mounted && (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={barChartData} layout="vertical" margin={{ left: -20 }}>
                            <XAxis type="number" hide />
                            <YAxis 
                               type="category" 
                               dataKey="name" 
                               axisLine={false} 
                               tickLine={false} 
                               width={120}
                               tick={{ fill: '#475569', fontWeight: 700, fontSize: 10 }} 
                               tickFormatter={(val) => val.substring(0, 15) + '...'}
                            />
                            <RechartsTooltip 
                               cursor={{ fill: '#F8FAFC' }}
                               contentStyle={{ borderRadius: '12px', fontSize: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}
                            />
                            <Bar dataKey="clicks" fill="var(--primary)" radius={[0, 10, 10, 0]} barSize={24} />
                          </BarChart>
                        </ResponsiveContainer>
                       )}
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </div>
        )}

        {activeMenuItem === 'history' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 w-full">
             <Flex justify="space-between" align="flex-end" className="mb-10">
               <div className="flex flex-col">
                  <Typography.Title level={2} className="!text-4xl !font-black !tracking-tighter !m-0">
                    {DASHBOARD_CONSTANTS.HISTORY.HEADING}
                  </Typography.Title>
                  <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest mt-1">Audit log & link management</span>
               </div>
               <div className="px-4 py-2 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                 {urls.length} TOTAL LINKS
               </div>
             </Flex>

             {urls.length === 0 ? (
               <Card className="premium-card !p-20 border-2 border-dashed border-slate-200 bg-slate-50/50">
                  <Flex vertical align="center" justify="center">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6">
                      <LinkIcon size={32} className="text-slate-300" />
                    </div>
                    <Typography.Title level={5} className="!font-extrabold !text-slate-400 !uppercase !tracking-widest">
                       {DASHBOARD_CONSTANTS.HISTORY.NO_LINKS}
                    </Typography.Title>
                    <Button className="mt-6" onClick={() => setActiveMenuItem('overall')}>Create First Link</Button>
                  </Flex>
               </Card>
             ) : (
               <div className="flex flex-col gap-4">
                 {urls.map((record) => (
                   <div key={record.id} className="premium-card !p-0 group relative hover:ring-2 hover:ring-indigo-100 ring-0 transition-all overflow-hidden border-none ring-1 ring-slate-200">
                      <div className="flex flex-col lg:flex-row lg:items-center">
                         {/* Link Primary Info */}
                         <div className="flex-grow p-6 flex flex-col gap-1 border-b lg:border-b-0 lg:border-r border-slate-100">
                            <div className="flex items-center gap-2 mb-1">
                               <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                               <a href={record.short_url} target="_blank" rel="noreferrer" className="text-xl font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                                 {record.short_url.replace(/^https?:\/\//, '')}
                               </a>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400">
                               <div className="flex-shrink-0"><Globe size={12} /></div>
                               <p className="text-xs font-medium m-0 truncate max-w-md">{record.original_url}</p>
                            </div>
                         </div>

                         {/* Quick Stats */}
                         <div className="grid grid-cols-2 lg:flex lg:items-center gap-8 p-6 bg-slate-50/50">
                            <div className="flex flex-col">
                               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Clicks</span>
                               <span className="text-lg font-black">{record.clicks}</span>
                            </div>
                            <div className="flex flex-col">
                               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Created</span>
                               <span className="text-xs font-bold text-slate-600">
                                 {new Date(record.created_at).toLocaleDateString(undefined, { month: 'short', day: '2-digit' })}
                               </span>
                            </div>
                            
                            {/* Operations */}
                            <div className="col-span-2 lg:col-span-1 lg:ml-4 flex items-center gap-1">
                               {[
                                 { tip: DASHBOARD_CONSTANTS.HISTORY.TOOLTIP_ANALYTICS, ico: <BarChartIcon size={18}/>, fn: () => openAnalytics(record), danger: false },
                                 { tip: DASHBOARD_CONSTANTS.HISTORY.TOOLTIP_COPY, ico: <Copy size={18}/>, fn: () => handleCopy(record.short_url), danger: false },
                                 { tip: DASHBOARD_CONSTANTS.HISTORY.TOOLTIP_QR, ico: <QrCode size={18}/>, fn: () => handleQrCode(record.short_url), danger: false },
                                 { tip: DASHBOARD_CONSTANTS.HISTORY.TOOLTIP_DELETE, ico: <Trash2 size={18}/>, fn: () => handleDelete(record.short_code), danger: true }
                               ].map((action, idx) => (action &&
                                 <ToolTip key={idx} title={action.tip}>
                                    <Button 
                                      onClick={action.fn} 
                                      icon={action.ico} 
                                      type="text" 
                                      shape="circle"
                                      danger={action.danger}
                                      className="!flex !items-center !justify-center !p-0 !w-9 !h-9 hover:!bg-white" 
                                    />
                                 </ToolTip>
                               ))}
                            </div>
                         </div>
                      </div>
                   </div>
                 ))}
               </div>
             )}
          </div>
        )}

      </Layout.Content>

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
    </Layout>
  );
}
