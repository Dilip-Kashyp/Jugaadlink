"use client";
import React, { useState } from "react";
import { message, DatePicker, InputNumber } from "antd";
import dayjs from "dayjs";
import { QRCodeSVG } from "qrcode.react";
import {
  Copy, Share2, QrCode, Trash2, LinkIcon, TrendingUp, Calendar,
  BarChart2, Activity, LayoutDashboard, List,
  BarChart as BarChartIcon, Settings, Lock, Clock, Info, ChevronDown, ChevronUp,
  Zap, Globe, Tag, Folder, MessageSquare, ExternalLink, Check, X, Power,
  Pencil, ChevronRight, FolderOpen,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid
} from "recharts";
import {
  useUrlShortener, useUrlHistory, useDeleteUrl, useToggleUrl, useUpdateUrl,
  useCurrentUser, UrlItem, ShortenResult
} from "@/app/Services";
import {
  Flex, Typography, AnalyticsModal, WorldMapChart, Modal, ToolTip,
  Button, Card, Input
} from "@/app/components/common";
import { DASHBOARD_CONSTANTS, YOU_CAN_CREATE_MORE_LINKS, API_ENDPOINTS } from "@/app/constants";
import { UpdateUrlPayload } from "@/app/Services/urlService";

// ─── Edit Link Modal ──────────────────────────────────────────────────────────

interface EditModalProps {
  open: boolean;
  record: UrlItem | null;
  onClose: () => void;
  onSave: (shortCode: string, data: UpdateUrlPayload) => void;
  isPending: boolean;
}

function EditLinkModal({ open, record, onClose, onSave, isPending }: EditModalProps) {
  const [newPassword, setNewPassword] = useState("");
  const [clearPassword, setClearPassword] = useState(false);
  const [maxClicks, setMaxClicks] = useState<number | undefined>(undefined);
  const [expiryDate, setExpiryDate] = useState<string | undefined>(undefined);
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("");
  const [comment, setComment] = useState("");
  const [isActive, setIsActive] = useState(true);

  React.useEffect(() => {
    if (record) {
      setNewPassword("");
      setClearPassword(false);
      setMaxClicks(record.max_clicks || undefined);
      setExpiryDate(record.expires_at || undefined);
      setTags(record.tags || "");
      setCategory(record.category || "");
      setComment(record.comment || "");
      setIsActive(record.is_active !== false);
    }
  }, [record]);

  const handleSave = () => {
    if (!record) return;
    const payload: UpdateUrlPayload = {};
    if (clearPassword) {
      payload.password = "";
    } else if (newPassword) {
      payload.password = newPassword;
    }
    if (maxClicks !== undefined) payload.max_clicks = maxClicks;
    if (expiryDate !== undefined) payload.expires_at = expiryDate;
    payload.tags = tags;
    payload.category = category;
    payload.comment = comment;
    payload.is_active = isActive;
    onSave(record.short_code, payload);
  };

  if (!record) return null;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      title={
        <div className="flex items-center gap-2 text-[var(--foreground)]">
          <Pencil size={18} className="text-[var(--primary)]" />
          <span className="font-black">Edit Link</span>
        </div>
      }
      width={520}
    >
      <div className="flex flex-col gap-5 pt-4">
        {/* Short URL reference */}
        <div className="px-3 py-2.5 bg-[var(--background-muted)] rounded-lg text-xs font-mono text-[var(--foreground-muted)] truncate">
          {record.short_url}
        </div>

        {/* Active toggle */}
        <div className="flex items-center justify-between p-4 bg-[var(--background-subtle)] border border-[var(--border-default)] rounded-xl">
          <div>
            <div className="text-sm font-semibold text-[var(--foreground)]">Link Status</div>
            <div className="text-xs text-[var(--foreground-muted)]">
              {isActive ? "Active — link is accessible" : "Inactive — link is disabled"}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${isActive ? "bg-emerald-500" : "bg-[var(--border-default)]"}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isActive ? "translate-x-6" : "translate-x-0"}`} />
          </button>
        </div>

        {/* Password section */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-semibold text-[var(--foreground-muted)] flex items-center gap-1.5 uppercase tracking-wider">
            <Lock size={11} /> Password
          </label>
          {record.has_password && !clearPassword && (
            <div className="flex items-center justify-between px-3 py-2 bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 rounded-lg">
              <span className="text-xs text-violet-600 dark:text-violet-400 font-medium">Password currently set</span>
              <button
                type="button"
                onClick={() => setClearPassword(true)}
                className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors"
              >
                Remove password
              </button>
            </div>
          )}
          {clearPassword && (
            <div className="flex items-center justify-between px-3 py-2 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg">
              <span className="text-xs text-red-600 dark:text-red-400 font-medium">Password will be removed on save</span>
              <button
                type="button"
                onClick={() => setClearPassword(false)}
                className="text-xs font-semibold text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
          {!clearPassword && (
            <Input
              type="password"
              placeholder={record.has_password ? "Enter new password to change" : "Set a password (optional)"}
              value={newPassword}
              onChange={(e: any) => setNewPassword(e.target.value)}
              className="!h-10 !rounded-lg"
            />
          )}
        </div>

        {/* Max Clicks + Expiry */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-[var(--foreground-muted)] flex items-center gap-1.5 uppercase tracking-wider">
              <Activity size={11} /> Max Clicks
            </label>
            <InputNumber
              min={0}
              placeholder="Unlimited"
              value={maxClicks}
              onChange={(val: any) => setMaxClicks(val || undefined)}
              className="!w-full !rounded-lg !h-10"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-[var(--foreground-muted)] flex items-center gap-1.5 uppercase tracking-wider">
              <Clock size={11} /> Expiry Date
            </label>
            <DatePicker
              showTime
              placeholder="No expiry"
              value={expiryDate ? dayjs(expiryDate) : undefined}
              onChange={(date: any) => setExpiryDate(date ? date.toISOString() : undefined)}
              className="!w-full !rounded-lg !h-10"
            />
          </div>
        </div>

        {/* Tags + Category */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-[var(--foreground-muted)] flex items-center gap-1.5 uppercase tracking-wider">
              <Tag size={11} /> Tags
            </label>
            <input
              type="text"
              placeholder="e.g. work, personal"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-[var(--background-subtle)] border border-[var(--border-default)] text-sm px-3 py-2.5 rounded-lg outline-none transition-all placeholder:text-[var(--foreground-placeholder)] text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-subtle)]"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-[var(--foreground-muted)] flex items-center gap-1.5 uppercase tracking-wider">
              <Folder size={11} /> Category
            </label>
            <input
              type="text"
              placeholder="e.g. GitHub, Work"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[var(--background-subtle)] border border-[var(--border-default)] text-sm px-3 py-2.5 rounded-lg outline-none transition-all placeholder:text-[var(--foreground-placeholder)] text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-subtle)]"
            />
          </div>
        </div>

        {/* Comment */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-[var(--foreground-muted)] flex items-center gap-1.5 uppercase tracking-wider">
            <MessageSquare size={11} /> Note
          </label>
          <textarea
            placeholder="Add a note..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={2}
            className="w-full bg-[var(--background-subtle)] border border-[var(--border-default)] text-sm px-3 py-2.5 rounded-lg outline-none transition-all placeholder:text-[var(--foreground-placeholder)] text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-subtle)] resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <Button
            type="default"
            onClick={onClose}
            className="!flex-1 !h-11 !rounded-xl !font-semibold"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleSave}
            loading={isPending}
            className="!flex-1 !h-11 !rounded-xl !font-bold"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Link Card ────────────────────────────────────────────────────────────────

interface LinkCardProps {
  record: UrlItem;
  onToggle: (code: string) => void;
  onEdit: (record: UrlItem) => void;
  onAnalytics: (record: UrlItem) => void;
  onCopy: (text: string) => void;
  onQrCode: (url: string) => void;
  onShare: (record: UrlItem) => void;
  onDelete: (code: string) => void;
}

function LinkCard({ record, onToggle, onEdit, onAnalytics, onCopy, onQrCode, onShare, onDelete }: LinkCardProps) {
  return (
    <div className="bg-[var(--background-subtle)] border border-[var(--border-default)] rounded-xl p-4 sm:p-5 group hover:border-[var(--primary)] hover:shadow-md transition-all">
      <div className="flex flex-col gap-3">
        {/* Top row: status dot + short URL */}
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${record.is_active !== false ? 'bg-emerald-500' : 'bg-red-400'}`} />
          <a href={record.short_url} target="_blank" rel="noreferrer" className="text-base sm:text-lg font-bold text-[var(--primary)] hover:underline truncate">
            {record.short_url.replace(/^https?:\/\//, '')}
          </a>
        </div>

        {/* Original URL */}
        <div className="flex items-center gap-1.5 text-[var(--foreground-subtle)]">
          <Globe size={12} className="flex-shrink-0" />
          <span className="text-sm truncate">{record.original_url}</span>
        </div>

        {/* Tags / badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          {record.tags && record.tags.split(',').map((tag, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[11px] font-semibold">
              <Tag size={10} /> {tag.trim()}
            </span>
          ))}
          {record.category && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-semibold">
              <Folder size={10} /> {record.category}
            </span>
          )}
          {record.comment && (
            <ToolTip title={record.comment}>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[var(--foreground-muted)] text-[11px] font-medium cursor-help">
                <MessageSquare size={10} /> Note
              </span>
            </ToolTip>
          )}
          {record.has_password && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 text-[11px] font-semibold border border-violet-200 dark:border-violet-500/20">
              <Lock size={10} /> {DASHBOARD_CONSTANTS.HISTORY.BADGE_PASSWORD}
            </span>
          )}
          {(record.expires_at || (record.max_clicks && record.max_clicks > 0)) && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[11px] font-semibold border border-rose-200 dark:border-rose-500/20">
              <Clock size={10} /> {record.max_clicks && record.max_clicks > 0 ? DASHBOARD_CONSTANTS.HISTORY.BADGE_LIMITED : DASHBOARD_CONSTANTS.HISTORY.BADGE_TEMPORARY}
            </span>
          )}
        </div>

        {/* Bottom row: stats + actions */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-[var(--border-muted)]">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-[10px] font-semibold text-[var(--foreground-muted)] uppercase mb-0.5">Clicks</div>
              <div className="text-lg font-black">{record.clicks}</div>
            </div>
            <div className="text-center hidden xs:block">
              <div className="text-[10px] font-semibold text-[var(--foreground-muted)] uppercase mb-0.5">Created</div>
              <div className="text-sm font-bold text-[var(--foreground-muted)]">
                {new Date(record.created_at).toLocaleDateString(undefined, { month: 'short', day: '2-digit' })}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-0.5 flex-wrap justify-end">
            <ToolTip title={record.is_active !== false ? DASHBOARD_CONSTANTS.HISTORY.TOOLTIP_DEACTIVATE : DASHBOARD_CONSTANTS.HISTORY.TOOLTIP_ACTIVATE}>
              <Button
                onClick={() => onToggle(record.short_code)}
                icon={<Power size={15} />}
                type="text" shape="circle"
                className={`!flex !items-center !justify-center !w-8 !h-8 hover:!bg-[var(--background-muted)] !p-0 ${record.is_active !== false ? '!text-emerald-500' : '!text-red-400'}`}
              />
            </ToolTip>
            <ToolTip title="Edit link">
              <Button
                onClick={() => onEdit(record)}
                icon={<Pencil size={15} />}
                type="text" shape="circle"
                className="!flex !items-center !justify-center !w-8 !h-8 hover:!bg-[var(--background-muted)] !text-[var(--foreground-muted)] !p-0"
              />
            </ToolTip>
            {[
              { tip: DASHBOARD_CONSTANTS.HISTORY.TOOLTIP_ANALYTICS, ico: <BarChartIcon size={15} />, fn: () => onAnalytics(record), danger: false },
              { tip: DASHBOARD_CONSTANTS.HISTORY.TOOLTIP_COPY, ico: <Copy size={15} />, fn: () => onCopy(record.short_url), danger: false },
              { tip: DASHBOARD_CONSTANTS.HISTORY.TOOLTIP_QR, ico: <QrCode size={15} />, fn: () => onQrCode(record.short_url), danger: false },
              { tip: DASHBOARD_CONSTANTS.HISTORY.TOOLTIP_DELETE, ico: <Trash2 size={15} />, fn: () => onDelete(record.short_code), danger: true },
            ].map((action, idx) => (
              <ToolTip key={idx} title={action.tip}>
                <Button onClick={action.fn} icon={action.ico} type="text" shape="circle" danger={action.danger}
                  className="!flex !items-center !justify-center !w-8 !h-8 hover:!bg-[var(--background-muted)] !text-[var(--foreground-muted)] !p-0"
                />
              </ToolTip>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Category Group ───────────────────────────────────────────────────────────

interface CategoryGroupProps {
  name: string;
  links: UrlItem[];
  onToggle: (code: string) => void;
  onEdit: (record: UrlItem) => void;
  onAnalytics: (record: UrlItem) => void;
  onCopy: (text: string) => void;
  onQrCode: (url: string) => void;
  onShare: (record: UrlItem) => void;
  onDelete: (code: string) => void;
}

function CategoryGroup({ name, links, ...handlers }: CategoryGroupProps) {
  const [collapsed, setCollapsed] = useState(false);
  const isUncategorized = name === "__uncategorized__";

  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-[var(--background-subtle)] border border-[var(--border-default)] rounded-xl hover:border-[var(--primary)] transition-all group mb-2"
      >
        {collapsed
          ? <Folder size={18} className="text-amber-500 flex-shrink-0" />
          : <FolderOpen size={18} className="text-amber-500 flex-shrink-0" />
        }
        <span className="font-bold text-[var(--foreground)] text-sm flex-grow text-left">
          {isUncategorized ? "Uncategorized" : name}
        </span>
        <span className="px-2.5 py-0.5 rounded-full bg-[var(--background-muted)] text-[var(--foreground-muted)] text-xs font-bold">
          {links.length}
        </span>
        {collapsed
          ? <ChevronRight size={16} className="text-[var(--foreground-subtle)] group-hover:text-[var(--primary)] transition-colors" />
          : <ChevronDown size={16} className="text-[var(--foreground-subtle)] group-hover:text-[var(--primary)] transition-colors" />
        }
      </button>

      {!collapsed && (
        <div className="flex flex-col gap-3 pl-2 mt-3">
          {links.map((record) => (
            <LinkCard key={record.id} record={record} {...handlers} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { data: historyData, refetch: refetchHistory } = useUrlHistory();
  const { data: user } = useCurrentUser();

  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('overall');
  const [analyticsModalOpen, setAnalyticsModalOpen] = useState(false);
  const [selectedAnalyticsLink, setSelectedAnalyticsLink] = useState<UrlItem | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<UrlItem | null>(null);
  const [mounted, setMounted] = React.useState(false);

  // Form state
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [password, setPassword] = useState("");
  const [maxClicks, setMaxClicks] = useState<number | undefined>(undefined);
  const [expiryDate, setExpiryDate] = useState<string | undefined>(undefined);
  const [urlInput, setUrlInput] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("");
  const [comment, setComment] = useState("");
  const [customDomain, setCustomDomain] = useState("");

  // Success popup state
  const [successData, setSuccessData] = useState<{ short_url: string; short_code: string; original_url: string; title?: string } | null>(null);

  React.useEffect(() => { setMounted(true); }, []);

  const [messageApi, contextHolder] = message.useMessage();

  const shortenerHandler = useUrlShortener({
    mutationConfig: {
      onSuccess: (data: any) => {
        refetchHistory();
        const result = data?.data || data;
        setSuccessData({
          short_url: result.short_url,
          short_code: result.short_code,
          original_url: result.original_url || urlInput,
          title: result.title,
        });
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
    setTags("");
    setCategory("");
    setComment("");
    setCustomDomain("");
    setCustomSlug("");
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

  const toggleHandler = useToggleUrl({
    mutationConfig: {
      onSuccess: (data: any) => {
        const status = data?.data?.is_active;
        messageApi.success(status ? DASHBOARD_CONSTANTS.MESSAGES.LINK_ACTIVATED : DASHBOARD_CONSTANTS.MESSAGES.LINK_DEACTIVATED);
        refetchHistory();
      },
      onError: () => messageApi.error(DASHBOARD_CONSTANTS.MESSAGES.TOGGLE_FAILED),
    },
  });

  const updateHandler = useUpdateUrl({
    mutationConfig: {
      onSuccess: () => {
        messageApi.success("Link updated successfully");
        setEditModalOpen(false);
        setEditingRecord(null);
        refetchHistory();
      },
      onError: (err: any) => {
        messageApi.error(err?.response?.data?.message || "Failed to update link");
      },
    },
  });

  const handleToggle = (shortCode: string) => toggleHandler.mutate(shortCode);
  const handleEdit = (record: UrlItem) => { setEditingRecord(record); setEditModalOpen(true); };
  const handleEditSave = (shortCode: string, data: any) => updateHandler.mutate({ shortCode, data });

  function handleShortenUrl(e: React.FormEvent) {
    e.preventDefault();
    if (urlInput) {
      shortenerHandler.mutate({
        data: {
          original_url: urlInput,
          custom_slug: customSlug || undefined,
          password: password || undefined,
          max_clicks: maxClicks,
          expires_at: expiryDate,
          tags: tags || undefined,
          category: category || undefined,
          comment: comment || undefined,
          custom_domain: customDomain || undefined,
        },
      });
    }
  }

  const handleDelete = (shortCode: string) => deleteHandler.mutate(shortCode);
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      messageApi.success(DASHBOARD_CONSTANTS.MESSAGES.LINK_COPIED_SUCCESS);
    });
  };
  const handleShare = async (record: UrlItem) => {
    const url = record.short_url;
    if (navigator.share) {
      try { await navigator.share({ url }); } catch { }
    } else {
      navigator.clipboard.writeText(url).then(() => messageApi.info(DASHBOARD_CONSTANTS.MESSAGES.LINK_COPIED_FALLBACK));
    }
  };
  const handleQrCode = (shortCode: string) => { setQrUrl(shortCode); setQrModalOpen(true); };
  const openAnalytics = (record: UrlItem) => { setSelectedAnalyticsLink(record); setAnalyticsModalOpen(true); };

  const urls: UrlItem[] = historyData?.data?.history || [];

  // Category grouping
  const groupedByCategory = React.useMemo(() => {
    const groups: Record<string, UrlItem[]> = {};
    for (const url of urls) {
      const key = url.category?.trim() || "__uncategorized__";
      if (!groups[key]) groups[key] = [];
      groups[key].push(url);
    }
    // Sort: named categories first (alphabetically), then uncategorized
    const sorted: [string, UrlItem[]][] = Object.entries(groups).sort(([a], [b]) => {
      if (a === "__uncategorized__") return 1;
      if (b === "__uncategorized__") return -1;
      return a.localeCompare(b);
    });
    return sorted;
  }, [urls]);

  const hasCategories = groupedByCategory.some(([key]) => key !== "__uncategorized__");

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

  const [dashboardRegionData, setDashboardRegionData] = React.useState<any[]>([]);
  React.useEffect(() => {
    if (urls.length > 0) {
      import('@/app/Services/apiClient').then(({ api }) => {
        api.get(API_ENDPOINTS.ANALYTICS_INTERVAL_ALL).then((res: any) => {
          const data = res?.data || res || {};
          setDashboardRegionData(data.regions || []);
        }).catch(() => {});
      });
    }
  }, [urls]);

  const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);

  const linkCardHandlers = {
    onToggle: handleToggle,
    onEdit: handleEdit,
    onAnalytics: openAnalytics,
    onCopy: handleCopy,
    onQrCode: handleQrCode,
    onShare: handleShare,
    onDelete: handleDelete,
  };

  return (
    <div className="min-h-screen bg-[var(--background)] relative w-full">
      {contextHolder}

      {/* Edit Modal */}
      <EditLinkModal
        open={editModalOpen}
        record={editingRecord}
        onClose={() => { setEditModalOpen(false); setEditingRecord(null); }}
        onSave={handleEditSave}
        isPending={updateHandler.isPending}
      />

      {/* Success Popup */}
      {successData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-premium m-3">
          <div className="bg-[var(--background-subtle)] border border-[var(--border-default)] rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 relative">
            <button onClick={() => setSuccessData(null)} className="absolute top-4 right-4 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">
              <X size={20} />
            </button>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Check className="text-emerald-500" size={32} />
              </div>
              <h3 className="text-2xl font-black font-heading m-0 mb-1">
                {DASHBOARD_CONSTANTS.SUCCESS_POPUP.TITLE}
              </h3>
              <p className="text-sm text-[var(--foreground-muted)]">
                {DASHBOARD_CONSTANTS.SUCCESS_POPUP.SUBTITLE}
              </p>
            </div>

            <div className="bg-[var(--background)] rounded-xl p-4 mb-4 border border-[var(--border-default)]">
              <label className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-wider mb-2 block">{DASHBOARD_CONSTANTS.SUCCESS_POPUP.LABEL_SHORT}</label>
              <div className="flex items-center gap-3">
                <span className="flex-grow font-mono text-[var(--primary)] font-bold text-base truncate">
                  {successData.short_url}
                </span>
                <Button
                  type="primary"
                  icon={<Copy size={14} />}
                  onClick={() => handleCopy(successData.short_url)}
                  className="!h-9 !px-4 !rounded-lg !text-sm !font-semibold !py-0"
                >
                  {DASHBOARD_CONSTANTS.SUCCESS_POPUP.COPY_BUTTON}
                </Button>
              </div>
            </div>

            <div className="bg-[var(--background)] rounded-xl p-4 mb-6 border border-[var(--border-default)]">
              <label className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-wider mb-1 block">{DASHBOARD_CONSTANTS.SUCCESS_POPUP.LABEL_ORIGINAL}</label>
              <span className="text-sm text-[var(--foreground-muted)] truncate block">{successData.original_url}</span>
              {successData.title && (
                <span className="text-xs text-[var(--foreground-subtle)] mt-1 block">{successData.title}</span>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                type="default"
                onClick={() => { openAnalytics({ short_code: successData.short_code, short_url: successData.short_url, original_url: successData.original_url, clicks: 0, id: '', created_at: '' }); setSuccessData(null); }}
                className="!flex-1 !h-11 !rounded-xl !font-semibold !text-sm"
                icon={<BarChartIcon size={16} />}
              >
                {DASHBOARD_CONSTANTS.SUCCESS_POPUP.VIEW_STATS}
              </Button>
              <Button
                type="primary"
                onClick={() => setSuccessData(null)}
                className="!flex-1 !h-11 !rounded-xl !font-semibold !text-sm"
              >
                {DASHBOARD_CONSTANTS.SUCCESS_POPUP.DONE}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Tab Bar */}
      <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="glass rounded-full px-1.5 sm:px-2 py-1.5 sm:py-2 shadow-xl flex items-center gap-0.5 sm:gap-1">
          <button
            onClick={() => setActiveTab('overall')}
            className={`flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${activeTab === 'overall' ? 'bg-[var(--primary)] text-white shadow-md' : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-muted)]'}`}
          >
            <LayoutDashboard size={16} /> <span className="hidden xs:inline">{DASHBOARD_CONSTANTS.MENU.OVERALL_LINKS}</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${activeTab === 'history' ? 'bg-[var(--primary)] text-white shadow-md' : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-muted)]'}`}
          >
            <List size={16} /> <span className="hidden xs:inline">{DASHBOARD_CONSTANTS.MENU.HISTORY_LOG}</span>
          </button>
        </div>
      </div>

      {/* QR Modal */}
      <Modal open={qrModalOpen} onCancel={() => setQrModalOpen(false)} footer={null} centered>
        <Flex vertical align="center" gap={24} className="p-8">
          <Typography.Title level={3} className="!font-black !text-center !m-0">{DASHBOARD_CONSTANTS.MODAL.QR_SCANNER}</Typography.Title>
          <div className="p-6 bg-white rounded-2xl shadow-inner">
            {qrUrl && <QRCodeSVG value={qrUrl} size={200} level="H" />}
          </div>
          <div className="w-full p-3 bg-[var(--background-muted)] rounded-xl text-center">
            <span className="text-[var(--foreground-muted)] font-mono text-xs break-all">{qrUrl}</span>
          </div>
          <Button block type="primary" onClick={() => handleCopy(qrUrl || "")} className="!rounded-xl !h-11">Copy Link</Button>
        </Flex>
      </Modal>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-32">

        {activeTab === 'overall' && (
          <div className="animate-premium">
            {/* Hero */}
            <div className="text-center mb-8 sm:mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-black font-heading tracking-tight mb-4 text-[var(--foreground)] leading-[1.1]">
                {DASHBOARD_CONSTANTS.HERO.HEADING_LINE_1}{' '}
                <span className="text-[var(--primary)]">{DASHBOARD_CONSTANTS.HERO.HEADING_LINE_2}</span>
              </h1>
              <p className="text-[var(--foreground-muted)] text-base sm:text-lg max-w-xl mx-auto">{DASHBOARD_CONSTANTS.HERO.SUBTEXT}</p>
            </div>

            {/* URL Form */}
            <Card className="!p-4 sm:!p-6 md:!p-8 !rounded-2xl !border-[var(--border-default)] !bg-[var(--background-subtle)] shadow-lg mb-10 sm:mb-16">
              <form onSubmit={handleShortenUrl} className="flex flex-col gap-4 sm:gap-5">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder={DASHBOARD_CONSTANTS.FORM.PLACEHOLDER}
                    required
                    className="flex-1 w-full bg-[var(--background)] border border-[var(--border-default)] text-base sm:text-lg font-medium px-4 sm:pl-5 py-3 sm:py-4 rounded-xl outline-none transition-all placeholder:text-[var(--foreground-placeholder)] text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-subtle)]"
                  />
                  <Button
                    htmlType="submit"
                    loading={shortenerHandler.isPending}
                    className="!w-full sm:!w-auto !px-6 sm:!px-7 !h-12 sm:!h-auto !rounded-xl !bg-[var(--primary)] !text-white !font-bold !text-base hover:!bg-[var(--hover-primary)] !transition-all !shadow-md !py-0"
                  >
                    {DASHBOARD_CONSTANTS.FORM.BUTTON_DEFAULT}
                  </Button>
                </div>

                <div className="flex items-center justify-between px-1">
                  <button type="button" onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-sm font-medium text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors"
                  >
                    <Settings size={16} /> {DASHBOARD_CONSTANTS.FORM.ADVANCED_OPTIONS}
                    {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {!user && (
                    <span className="flex items-center gap-1.5 text-xs font-medium text-[var(--foreground-subtle)]">
                      <Info size={14} className="text-amber-500" /> {YOU_CAN_CREATE_MORE_LINKS}
                    </span>
                  )}
                </div>

                {showAdvanced && (
                  <div className="space-y-4 p-5 bg-[var(--background)] rounded-xl border border-[var(--border-default)]">
                    {/* Custom Alias */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-[var(--foreground-muted)] flex items-center gap-1.5 uppercase tracking-wider">
                        <LinkIcon size={12} /> Custom Alias
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-sm text-[var(--foreground-subtle)] font-medium select-none pointer-events-none">
                          {typeof window !== 'undefined' ? window.location.host : ''}/
                        </span>
                        <input
                          type="text"
                          placeholder="my-custom-link"
                          value={customSlug}
                          onChange={(e) => setCustomSlug(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                          minLength={3}
                          maxLength={20}
                          className="w-full bg-[var(--background-subtle)] border border-[var(--border-default)] text-sm pl-[calc(0.75rem+var(--host-len,6ch))] pr-3 py-2.5 rounded-lg outline-none transition-all placeholder:text-[var(--foreground-placeholder)] text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-subtle)]"
                          style={{ paddingLeft: `${(typeof window !== 'undefined' ? window.location.host.length : 9) + 2}ch` }}
                        />
                      </div>
                      <p className="text-[10px] text-[var(--foreground-subtle)]">3 to 20 characters. Letters, numbers, hyphens, and underscores only. Leave blank to auto-generate.</p>
                    </div>

                    {/* Tags + Category */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-semibold text-[var(--foreground-muted)] flex items-center gap-1.5 uppercase tracking-wider">
                          <Tag size={12} /> {DASHBOARD_CONSTANTS.FORM.TAGS}
                        </label>
                        <input
                          type="text"
                          placeholder={DASHBOARD_CONSTANTS.FORM.TAGS_PLACEHOLDER}
                          value={tags}
                          onChange={(e) => setTags(e.target.value)}
                          className="w-full bg-[var(--background-subtle)] border border-[var(--border-default)] text-sm px-3 py-2.5 rounded-lg outline-none transition-all placeholder:text-[var(--foreground-placeholder)] text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-subtle)]"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-semibold text-[var(--foreground-muted)] flex items-center gap-1.5 uppercase tracking-wider">
                          <Folder size={12} /> {DASHBOARD_CONSTANTS.FORM.CATEGORY}
                        </label>
                        <input
                          type="text"
                          placeholder={DASHBOARD_CONSTANTS.FORM.CATEGORY_PLACEHOLDER}
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full bg-[var(--background-subtle)] border border-[var(--border-default)] text-sm px-3 py-2.5 rounded-lg outline-none transition-all placeholder:text-[var(--foreground-placeholder)] text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-subtle)]"
                        />
                      </div>
                    </div>

                    {/* Comment */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-[var(--foreground-muted)] flex items-center gap-1.5 uppercase tracking-wider">
                        <MessageSquare size={12} /> {DASHBOARD_CONSTANTS.FORM.COMMENT}
                      </label>
                      <textarea
                        placeholder={DASHBOARD_CONSTANTS.FORM.COMMENT_PLACEHOLDER}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={2}
                        className="w-full bg-[var(--background-subtle)] border border-[var(--border-default)] text-sm px-3 py-2.5 rounded-lg outline-none transition-all placeholder:text-[var(--foreground-placeholder)] text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-subtle)] resize-none"
                      />
                    </div>

                    {/* Password, Max Clicks, Expiry */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-semibold text-[var(--foreground-muted)] flex items-center gap-1.5 uppercase tracking-wider">
                          <Lock size={12} /> {DASHBOARD_CONSTANTS.FORM.PASSWORD}
                        </label>
                        <Input type="password" placeholder="Optional" value={password} onChange={(e: any) => setPassword(e.target.value)} className="!h-10 !rounded-lg" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-semibold text-[var(--foreground-muted)] flex items-center gap-1.5 uppercase tracking-wider">
                          <Activity size={12} /> {DASHBOARD_CONSTANTS.FORM.MAX_CLICKS}
                        </label>
                        <InputNumber min={1} placeholder="Unlimited" value={maxClicks} onChange={(val: any) => setMaxClicks(val || undefined)} className="!w-full !rounded-lg !h-10" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-semibold text-[var(--foreground-muted)] flex items-center gap-1.5 uppercase tracking-wider">
                          <Clock size={12} /> {DASHBOARD_CONSTANTS.FORM.EXPIRY_DATE}
                        </label>
                        <DatePicker showTime placeholder="Set expiry" onChange={(date: any) => setExpiryDate(date ? date.toISOString() : undefined)} className="!w-full !rounded-lg !h-10" />
                      </div>
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
                  <h2 className="text-2xl font-black font-heading tracking-tight m-0">{DASHBOARD_CONSTANTS.PERFORMANCE.HEADING}</h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10 animate-stagger">
                  {[
                    { label: DASHBOARD_CONSTANTS.PERFORMANCE.OVERALL_CLICKS, val: totalClicks, ico: <BarChartIcon size={20} />, color: "emerald" },
                    { label: DASHBOARD_CONSTANTS.PERFORMANCE.ACTIVE_LINKS, val: urls.length, ico: <LinkIcon size={20} />, color: "indigo" },
                    { label: DASHBOARD_CONSTANTS.PERFORMANCE.AVG_CLICKS, val: urls.length ? (totalClicks / urls.length).toFixed(1) : 0, ico: <Zap size={20} />, color: "amber" },
                    { label: DASHBOARD_CONSTANTS.PERFORMANCE.LAST_7_DAYS, val: urls.filter(u => new Date(u.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length, ico: <TrendingUp size={20} />, color: "rose" }
                  ].map((stat, i) => (
                    <div key={i} className="p-4 sm:p-5 bg-[var(--background-subtle)] border border-[var(--border-default)] rounded-xl group hover:border-[var(--primary)] hover:shadow-md transition-all">
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className={`p-2 sm:p-2.5 rounded-lg bg-${stat.color}-50 dark:bg-${stat.color}-500/10 text-${stat.color}-600 dark:text-${stat.color}-400 group-hover:scale-110 transition-transform`}>
                          {stat.ico}
                        </div>
                      </div>
                      <div className="text-2xl sm:text-3xl font-black tracking-tight mb-1">{stat.val}</div>
                      <div className="text-[10px] sm:text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10">
                  <div className="p-6 bg-[var(--background-subtle)] border border-[var(--border-default)] rounded-xl">
                    <div className="flex items-center gap-2 text-sm font-bold text-[var(--foreground-muted)] uppercase tracking-wider mb-6">
                      <Calendar size={16} /> {DASHBOARD_CONSTANTS.PERFORMANCE.TRAFFIC_FORECAST}
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
                      <BarChart2 size={16} /> {DASHBOARD_CONSTANTS.PERFORMANCE.TOP_PERFORMING}
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

                {/* Geographic Heatmap */}
                <div className="p-6 bg-[var(--background-subtle)] border border-[var(--border-default)] rounded-xl">
                  <div className="flex items-center gap-2 text-sm font-bold text-[var(--foreground-muted)] uppercase tracking-wider mb-6">
                    <Globe size={16} /> {DASHBOARD_CONSTANTS.PERFORMANCE.GEOGRAPHIC_REACH}
                  </div>
                  <div className="rounded-xl overflow-hidden bg-[#0f172a] border border-[var(--border-default)]">
                    {mounted && (
                      <WorldMapChart regionData={dashboardRegionData} />
                    )}
                  </div>
                  {dashboardRegionData.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {dashboardRegionData.slice(0, 10).map((r: any, i: number) => (
                        <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 bg-[var(--background)] rounded-full border border-[var(--border-default)] text-xs">
                          <span className="font-semibold text-[var(--foreground-muted)]">{r.name}</span>
                          <span className="font-black text-[var(--foreground)]">{r.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="animate-premium">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 sm:mb-10">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black font-heading tracking-tight m-0 mb-1">{DASHBOARD_CONSTANTS.HISTORY.HEADING}</h2>
                <span className="text-sm font-medium text-[var(--primary)]">{DASHBOARD_CONSTANTS.HISTORY.TOTAL_LINKS} Archive</span>
              </div>
              <div className="px-4 py-2 rounded-full bg-[var(--primary)] text-white text-xs font-bold uppercase tracking-wider">
                {urls.length} link{urls.length !== 1 ? 's' : ''}
              </div>
            </div>

            {urls.length === 0 ? (
              <div className="p-16 bg-[var(--background-subtle)] border-2 border-dashed border-[var(--border-default)] rounded-2xl text-center">
                <LinkIcon size={40} className="mx-auto text-[var(--foreground-subtle)] mb-4" />
                <h4 className="font-bold text-[var(--foreground-muted)] mb-4">{DASHBOARD_CONSTANTS.HISTORY.NO_LINKS}</h4>
                <Button type="primary" onClick={() => setActiveTab('overall')} className="!rounded-xl !h-10">Create First Link</Button>
              </div>
            ) : hasCategories ? (
              /* Category directory view */
              <div>
                {groupedByCategory.map(([categoryKey, links]) => (
                  <CategoryGroup
                    key={categoryKey}
                    name={categoryKey}
                    links={links}
                    {...linkCardHandlers}
                  />
                ))}
              </div>
            ) : (
              /* Flat list when no categories are set */
              <div className="flex flex-col gap-3">
                {urls.map((record) => (
                  <LinkCard key={record.id} record={record} {...linkCardHandlers} />
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
