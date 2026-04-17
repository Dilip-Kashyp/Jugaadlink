"use client";
import React, { useState } from "react";
import { message, DatePicker, InputNumber } from "antd";
import { QRCodeSVG } from "qrcode.react";
import {
  Copy, Share2, QrCode, Trash2, LinkIcon, TrendingUp, Calendar,
  BarChart2, Activity, LayoutDashboard, List,
  BarChart as BarChartIcon, Settings, Lock, Clock, Info, ChevronDown, ChevronUp,
  Zap, Globe
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid
} from "recharts";
import {
  useUrlShortener, useUrlHistory, useDeleteUrl, useCurrentUser, useLinkPreview, UrlItem
} from "@/app/Services";
import {
  Flex, Typography, AnalyticsModal, Modal, ToolTip,
  Button, Card, Input
} from "@/app/components/common";
import { DASHBOARD_CONSTANTS, YOU_CAN_CREATE_MORE_LINKS } from "@/app/constants";

export default function Dashboard() {
  const { data: historyData, refetch: refetchHistory } = useUrlHistory();
  const { data: user } = useCurrentUser();

  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('overall');
  const [analyticsModalOpen, setAnalyticsModalOpen] = useState(false);
  const [selectedAnalyticsLink, setSelectedAnalyticsLink] = useState<UrlItem | null>(null);
  const [mounted, setMounted] = React.useState(false);

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [password, setPassword] = useState("");
  const [maxClicks, setMaxClicks] = useState<number | undefined>(undefined);
  const [expiryDate, setExpiryDate] = useState<string | undefined>(undefined);
  const [urlInput, setUrlInput] = useState("");

  React.useEffect(() => { setMounted(true); }, []);

  const [messageApi, contextHolder] = message.useMessage();

  const shortenerHandler = useUrlShortener({
    mutationConfig: {
      onSuccess: () => {
        refetchHistory();
        messageApi.success(DASHBOARD_CONSTANTS.MESSAGES.LINK_MINIMIZED_SUCCESS);
        resetForm();
      },
      onError: () => {
        messageApi.error(DASHBOARD_CONSTANTS.MESSAGES.LINK_MINIMIZED_ERROR);
      },
    },
  });

  const resetForm = () => {
    setUrlInput("");
    setPassword("");
    setMaxClicks(undefined);
    setExpiryDate(undefined);
    setShowAdvanced(false);
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
      try { await navigator.share({ url }); } catch { }
    } else {
      navigator.clipboard.writeText(url).then(() => {
        messageApi.info(DASHBOARD_CONSTANTS.MESSAGES.LINK_COPIED_FALLBACK);
      });
    }
  };
  const handleQrCode = (shortCode: string) => { setQrUrl(shortCode); setQrModalOpen(true); };
  const openAnalytics = (record: UrlItem) => { setSelectedAnalyticsLink(record); setAnalyticsModalOpen(true); };

  const urls: UrlItem[] = historyData?.data?.history || [];

  const timelineData = React.useMemo(() => {
    if (!urls.length) return [];
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
    })).sort((a, b) => b.clicks - a.clicks).slice(0, 5);
  }, [urls]);

  const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);

  return (
    <div className="min-h-screen bg-[var(--background)] relative w-full">
      {contextHolder}

      {/* Floating Tab Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="glass rounded-full px-2 py-2 shadow-xl flex items-center gap-1">
          <button
            onClick={() => setActiveTab('overall')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
              activeTab === 'overall'
                ? 'bg-[var(--primary)] text-white shadow-md'
                : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-muted)]'
            }`}
          >
            <LayoutDashboard size={16} /> {DASHBOARD_CONSTANTS.MENU.OVERALL_LINKS}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
              activeTab === 'history'
                ? 'bg-[var(--primary)] text-white shadow-md'
                : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-muted)]'
            }`}
          >
            <List size={16} /> {DASHBOARD_CONSTANTS.MENU.HISTORY_LOG}
          </button>
        </div>
      </div>

      {/* QR Modal */}
      <Modal open={qrModalOpen} onCancel={() => setQrModalOpen(false)} footer={null} centered>
        <Flex vertical align="center" gap={24} className="p-8">
          <Typography.Title level={3} className="!font-black !text-center !m-0">
            {DASHBOARD_CONSTANTS.MODAL.QR_SCANNER}
          </Typography.Title>
          <div className="p-6 bg-white rounded-2xl shadow-inner">
            {qrUrl && <QRCodeSVG value={qrUrl} size={200} level="H" />}
          </div>
          <div className="w-full p-3 bg-[var(--background-muted)] rounded-xl text-center">
            <span className="text-[var(--foreground-muted)] font-mono text-xs break-all">{qrUrl}</span>
          </div>
          <Button block type="primary" onClick={() => handleCopy(qrUrl || "")} className="!rounded-xl !h-11">
            Copy Link
          </Button>
        </Flex>
      </Modal>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 pb-32">

        {activeTab === 'overall' && (
          <div className="animate-premium">
            {/* Hero */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-black font-heading tracking-tight mb-4 text-[var(--foreground)] leading-[1.1]">
                {DASHBOARD_CONSTANTS.HERO.HEADING_LINE_1}{' '}
                <span className="text-[var(--primary)]">{DASHBOARD_CONSTANTS.HERO.HEADING_LINE_2}</span>
              </h1>
              <p className="text-[var(--foreground-muted)] text-lg max-w-xl mx-auto">
                {DASHBOARD_CONSTANTS.HERO.SUBTEXT}
              </p>
            </div>

            {/* URL Form */}
            <Card className="!p-6 md:!p-8 !rounded-2xl !border-[var(--border-default)] !bg-[var(--background-subtle)] shadow-lg mb-16">
              <form onSubmit={handleShortenUrl} className="flex flex-col gap-5">
                <div className="relative">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder={DASHBOARD_CONSTANTS.FORM.PLACEHOLDER}
                    required
                    className="w-full bg-[var(--background)] border border-[var(--border-default)] text-lg font-medium pl-5 pr-36 py-4 rounded-xl outline-none transition-all placeholder:text-[var(--foreground-placeholder)] text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-subtle)]"
                  />
                  <Button
                    htmlType="submit"
                    loading={shortenerHandler.isPending}
                    className="!absolute !right-2 !top-2 !bottom-2 !h-auto !px-7 !rounded-lg !bg-[var(--primary)] !text-white !font-bold !text-base hover:!bg-[var(--hover-primary)] !transition-all !shadow-md !py-0"
                  >
                    {DASHBOARD_CONSTANTS.FORM.BUTTON_DEFAULT}
                  </Button>
                </div>

                <div className="flex items-center justify-between px-1">
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-sm font-medium text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors"
                  >
                    <Settings size={16} />
                    {DASHBOARD_CONSTANTS.FORM.ADVANCED_OPTIONS}
                    {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {!user && (
                    <span className="flex items-center gap-1.5 text-xs font-medium text-[var(--foreground-subtle)]">
                      <Info size={14} className="text-amber-500" />
                      {YOU_CAN_CREATE_MORE_LINKS}
                    </span>
                  )}
                </div>

                {showAdvanced && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-[var(--background)] rounded-xl border border-[var(--border-default)]">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-[var(--foreground-muted)] flex items-center gap-1.5 uppercase tracking-wider">
                        <Lock size={12} /> {DASHBOARD_CONSTANTS.FORM.PASSWORD}
                      </label>
                      <Input
                        type="password"
                        placeholder="Optional"
                        value={password}
                        onChange={(e: any) => setPassword(e.target.value)}
                        className="!h-10 !rounded-lg"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-[var(--foreground-muted)] flex items-center gap-1.5 uppercase tracking-wider">
                        <Activity size={12} /> {DASHBOARD_CONSTANTS.FORM.MAX_CLICKS}
                      </label>
                      <InputNumber
                        min={1}
                        placeholder="Unlimited"
                        value={maxClicks}
                        onChange={(val: any) => setMaxClicks(val || undefined)}
                        className="!w-full !rounded-lg !h-10"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-[var(--foreground-muted)] flex items-center gap-1.5 uppercase tracking-wider">
                        <Clock size={12} /> {DASHBOARD_CONSTANTS.FORM.EXPIRY_DATE}
                      </label>
                      <DatePicker
                        showTime
                        placeholder="Set expiry"
                        onChange={(date: any) => setExpiryDate(date ? date.toISOString() : undefined)}
                        className="!w-full !rounded-lg !h-10"
                      />
                    </div>
                  </div>
                )}
              </form>
            </Card>

            {/* Stats */}
            {urls.length > 0 && (
              <div className="animate-premium">
                <div className="flex items-center gap-3 mb-8">
                  <Activity className="text-[var(--primary)]" size={22} />
                  <h2 className="text-2xl font-black font-heading tracking-tight m-0">
                    {DASHBOARD_CONSTANTS.PERFORMANCE.HEADING}
                  </h2>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10 animate-stagger">
                  {[
                    { label: DASHBOARD_CONSTANTS.PERFORMANCE.OVERALL_CLICKS, val: totalClicks, ico: <BarChartIcon size={20} />, color: "emerald" },
                    { label: DASHBOARD_CONSTANTS.PERFORMANCE.ACTIVE_LINKS, val: urls.length, ico: <LinkIcon size={20} />, color: "indigo" },
                    { label: DASHBOARD_CONSTANTS.PERFORMANCE.AVG_CLICKS, val: urls.length ? (totalClicks / urls.length).toFixed(1) : 0, ico: <Zap size={20} />, color: "amber" },
                    { label: DASHBOARD_CONSTANTS.PERFORMANCE.LAST_7_DAYS, val: urls.filter(u => new Date(u.created_at) > new Date(Date.now() - 7*24*60*60*1000)).length, ico: <TrendingUp size={20} />, color: "rose" }
                  ].map((stat, i) => (
                    <div key={i} className="p-5 bg-[var(--background-subtle)] border border-[var(--border-default)] rounded-xl group hover:border-[var(--primary)] hover:shadow-md transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-2.5 rounded-lg bg-${stat.color}-50 dark:bg-${stat.color}-500/10 text-${stat.color}-600 dark:text-${stat.color}-400 group-hover:scale-110 transition-transform`}>
                          {stat.ico}
                        </div>
                      </div>
                      <div className="text-3xl font-black tracking-tight mb-1">{stat.val}</div>
                      <div className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                  <div className="p-6 bg-[var(--background-subtle)] border border-[var(--border-default)] rounded-xl">
                    <div className="flex items-center gap-2 text-sm font-bold text-[var(--foreground-muted)] uppercase tracking-wider mb-6">
                      <Calendar size={16}/> {DASHBOARD_CONSTANTS.PERFORMANCE.TRAFFIC_FORECAST}
                    </div>
                    <div className="h-[260px]">
                      {mounted && (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={timelineData}>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--chart-grid)" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--foreground-muted)', fontWeight: 600, fontSize: 11 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--foreground-muted)', fontWeight: 600, fontSize: 11 }} />
                            <RechartsTooltip contentStyle={{ backgroundColor: 'var(--background-subtle)', border: '1px solid var(--border-default)', borderRadius: '12px', fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }} />
                            <Line type="monotone" dataKey="clicks" stroke="var(--primary)" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--primary)' }} />
                          </LineChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>

                  <div className="p-6 bg-[var(--background-subtle)] border border-[var(--border-default)] rounded-xl">
                    <div className="flex items-center gap-2 text-sm font-bold text-[var(--foreground-muted)] uppercase tracking-wider mb-6">
                      <BarChart2 size={16}/> {DASHBOARD_CONSTANTS.PERFORMANCE.TOP_PERFORMING}
                    </div>
                    <div className="h-[260px]">
                      {mounted && (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={barChartData} layout="vertical" margin={{ left: -20 }}>
                            <XAxis type="number" hide />
                            <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={140} tick={{ fill: 'var(--foreground-muted)', fontWeight: 600, fontSize: 11 }} tickFormatter={(val) => val.length > 18 ? val.substring(0, 18) + '...' : val} />
                            <RechartsTooltip cursor={{ fill: 'var(--background-muted)' }} contentStyle={{ borderRadius: '12px', fontSize: '13px', fontWeight: 600, border: 'none', boxShadow: '0 8px 16px rgba(0,0,0,0.1)', backgroundColor: 'var(--background-subtle)', color: 'var(--foreground)' }} />
                            <Bar dataKey="clicks" fill="var(--primary)" radius={[0, 8, 8, 0]} barSize={28} />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="animate-premium">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
              <div>
                <h2 className="text-3xl font-black font-heading tracking-tight m-0 mb-1">
                  {DASHBOARD_CONSTANTS.HISTORY.HEADING}
                </h2>
                <span className="text-sm font-medium text-[var(--primary)]">{DASHBOARD_CONSTANTS.HISTORY.TOTAL_LINKS} Archive</span>
              </div>
              <div className="px-4 py-2 rounded-full bg-[var(--primary)] text-white text-xs font-bold uppercase tracking-wider">
                {urls.length} entry(s)
              </div>
            </div>

            {urls.length === 0 ? (
              <div className="p-16 bg-[var(--background-subtle)] border-2 border-dashed border-[var(--border-default)] rounded-2xl text-center">
                <LinkIcon size={40} className="mx-auto text-[var(--foreground-subtle)] mb-4" />
                <h4 className="font-bold text-[var(--foreground-muted)] mb-4">{DASHBOARD_CONSTANTS.HISTORY.NO_LINKS}</h4>
                <Button type="primary" onClick={() => setActiveTab('overall')} className="!rounded-xl !h-10">Create First Link</Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {urls.map((record) => (
                  <div key={record.id} className="bg-[var(--background-subtle)] border border-[var(--border-default)] rounded-xl p-5 group hover:border-[var(--primary)] hover:shadow-md transition-all">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></span>
                          <a href={record.short_url} target="_blank" rel="noreferrer" className="text-lg font-bold text-[var(--primary)] hover:underline truncate">
                            {record.short_url.replace(/^https?:\/\//, '')}
                          </a>
                        </div>
                        <div className="flex items-center gap-1.5 text-[var(--foreground-subtle)]">
                          <Globe size={12} className="flex-shrink-0" />
                          <span className="text-sm truncate">{record.original_url}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 flex-shrink-0">
                        <div className="text-center">
                          <div className="text-xs font-semibold text-[var(--foreground-muted)] uppercase mb-0.5">Clicks</div>
                          <div className="text-xl font-black">{record.clicks}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs font-semibold text-[var(--foreground-muted)] uppercase mb-0.5">Created</div>
                          <div className="text-sm font-bold text-[var(--foreground-muted)]">
                            {new Date(record.created_at).toLocaleDateString(undefined, { month: 'short', day: '2-digit' })}
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {[
                            { tip: DASHBOARD_CONSTANTS.HISTORY.TOOLTIP_ANALYTICS, ico: <BarChartIcon size={16}/>, fn: () => openAnalytics(record), danger: false },
                            { tip: DASHBOARD_CONSTANTS.HISTORY.TOOLTIP_COPY, ico: <Copy size={16}/>, fn: () => handleCopy(record.short_url), danger: false },
                            { tip: DASHBOARD_CONSTANTS.HISTORY.TOOLTIP_QR, ico: <QrCode size={16}/>, fn: () => handleQrCode(record.short_url), danger: false },
                            { tip: DASHBOARD_CONSTANTS.HISTORY.TOOLTIP_DELETE, ico: <Trash2 size={16}/>, fn: () => handleDelete(record.short_code), danger: true }
                          ].map((action, idx) => (
                            <ToolTip key={idx} title={action.tip}>
                              <Button
                                onClick={action.fn}
                                icon={action.ico}
                                type="text"
                                shape="circle"
                                danger={action.danger}
                                className="!flex !items-center !justify-center !w-9 !h-9 hover:!bg-[var(--background-muted)] !text-[var(--foreground-muted)] !p-0"
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
      </div>

      <AnalyticsModal
        open={analyticsModalOpen}
        onClose={() => setAnalyticsModalOpen(false)}
        selectedLink={selectedAnalyticsLink}
        onCopy={handleCopy}
        onQrCode={handleQrCode}
        onShare={handleShare}
        onDelete={handleDelete}
      />
    </div>
  );
}
