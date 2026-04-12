"use client";
import React, { useEffect } from "react";
import { Modal, Tooltip } from "antd";
import { Copy, Share2, QrCode, Trash2, BarChart as BarChartIcon } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { Typography, Flex, Button } from "./index";
import Empty from "./Empty";
import { useUrlAnalytics } from "@/app/Services";
import { PIE_COLORS } from "@/app/constants";

interface UrlItem {
  id: string;
  original_url: string;
  short_code: string;
  short_url: string;
  clicks: number;
  created_at: string;
}

interface AnalyticsModalProps {
  open: boolean;
  onClose: () => void;
  selectedLink: UrlItem | null;
  onCopy: (url: string) => void;
  onQrCode: (url: string) => void;
  onShare: (record: UrlItem) => void;
  onDelete: (url: string) => void;
}

export default function AnalyticsModal({
  open,
  onClose,
  selectedLink,
  onCopy,
  onQrCode,
  onShare,
  onDelete
}: AnalyticsModalProps) {
  
  const [timelineData, setTimelineData] = React.useState<any[]>([]);
  const [deviceData, setDeviceData] = React.useState<any[]>([]);
  const [regionData, setRegionData] = React.useState<any[]>([]);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const analyticsHandler = useUrlAnalytics({
    mutationConfig: {
      onSuccess: (res: any) => {
        const data = res?.data || res || {};
        // Mapping typical backend formats to the state variables.
        setTimelineData(data.timeline || data.clicksByDate || data.daily || []);
        setDeviceData(data.devices || data.device || data.deviceUsage || []);
        setRegionData(data.regions || data.region || data.locations || []);
      },
      onError: (err: Error) => {
        console.error("Analytics fetch error.", err);
        setTimelineData([]);
        setDeviceData([]);
        setRegionData([]);
      }
    }
  });

  useEffect(() => {
    if (open && selectedLink) {
        // Change selectedLink.short_url to short_code, 
        // since the API expects an identifier for "/url/analytics/{shortCode}"
        analyticsHandler.mutate(selectedLink.short_code || selectedLink.short_url);
    }
  }, [open, selectedLink]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={900}
      className="neo-brutal-modal"
      rootClassName="[&_.ant-modal-content]:!rounded-none [&_.ant-modal-content]:!border-[var(--border-width)] [&_.ant-modal-content]:!border-[var(--border-default)] [&_.ant-modal-content]:!shadow-[var(--shadow-solid)] [&_.ant-modal-content]:!p-0 [&_.ant-modal-content]:!bg-[var(--background)] [&_.ant-modal-close]:hidden"
    >
      <Flex flexProps={{ vertical: true }}>
        <Flex 
          flexProps={{ 
            justify: "space-between", 
            align: "flex-start", 
            wrap: "wrap", 
            gap: 16,
            className: "p-6 border-b-[var(--border-width)] border-[var(--border-default)] relative"
          }}
        >
          <Button buttonProps={{ onClick: onClose, className: "absolute top-4 right-4 z-10 !text-xs !tracking-widest", danger: true }}>
            Close X
          </Button>
          
          <Flex flexProps={{ vertical: true }}>
            <Flex flexProps={{ align: "center", gap: 8 }}>
               <BarChartIcon />
               <Typography typographyProps={{ level: 3, className: "!font-black !uppercase !m-0 !tracking-widest" }}>
                 DETAILED ANALYTICS
               </Typography>
            </Flex>
            {selectedLink && (
              <Typography typographyProps={{ level: 5, ellipsis: true, className: "!mt-2 !text-sm !font-bold !opacity-80 max-w-sm" }}>
                Target: {selectedLink.original_url}
              </Typography>
            )}
          </Flex>

          {selectedLink && (
            <Flex flexProps={{ gap: 8 }}>
              <Tooltip title="Copy">
                <Button buttonProps={{ onClick: () => onCopy(selectedLink.short_url), icon: <Copy size={18} /> }} />
              </Tooltip>
              <Tooltip title="QR Code">
                <Button buttonProps={{ onClick: () => onQrCode(selectedLink.short_url), icon: <QrCode size={18} /> }} />
              </Tooltip>
              <Tooltip title="Share">
                 <Button buttonProps={{ onClick: () => onShare(selectedLink), icon: <Share2 size={18} /> }} />
              </Tooltip>
              <Tooltip title="Delete">
                 <Button buttonProps={{ onClick: () => { onDelete(selectedLink.short_url); onClose(); }, icon: <Trash2 size={18} />, danger: true }} />
              </Tooltip>
            </Flex>
          )}
        </Flex>

        {/* Content */}
        {selectedLink && (
           <div className="p-6 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                 <Flex flexProps={{ vertical: true, gap: 8, className: "neo-brutal bg-[var(--primary)] p-6 shadow-[4px_4px_0_0_var(--foreground)]" }}>
                    <Typography typographyProps={{ level: 5, className: "!text-sm !font-bold !uppercase !tracking-widest !m-0" }}>
                       Link Clicks
                    </Typography>
                    <Typography typographyProps={{ level: 2, className: "!text-6xl !font-black !m-0" }}>
                       {selectedLink.clicks}
                    </Typography>
                 </Flex>
                 <Flex flexProps={{ vertical: true, gap: 8, className: "neo-brutal bg-[var(--background-muted)] p-6 border-2 border-[var(--border-default)]" }}>
                    <Typography typographyProps={{ level: 5, className: "!text-sm !font-bold !uppercase !tracking-widest !m-0" }}>
                       Created At
                    </Typography>
                    <Typography typographyProps={{ level: 3, className: "!text-3xl !font-black !m-0" }}>
                       {new Date(selectedLink.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </Typography>
                 </Flex>
              </div>
              
              {selectedLink.clicks === 0 ? (
                <Flex flexProps={{ justify: 'center', className: 'py-10 neo-brutal bg-[var(--background-muted)] border-2 border-[var(--border-default)]' }}>
                  <Empty emptyProps={{ description: 'No analytics data available for this link' }} />
                </Flex>
              ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Traffic Graph */}
                <Flex flexProps={{ vertical: true, className: "neo-brutal bg-[var(--secondary)] p-6 h-[300px] md:col-span-3" }}>
                   <Typography typographyProps={{ level: 5, className: "!text-sm !font-black !uppercase !mb-4" }}>
                      Traffic Forecast (7d)
                   </Typography>
                   <div className="flex-grow w-full">
                     {mounted && (
                     <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={timelineData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                          <XAxis dataKey="name" stroke="var(--chart-text)" tick={{ fill: 'var(--chart-text)', fontWeight: 'bold', fontSize: 12 }} />
                          <YAxis stroke="var(--chart-text)" tick={{ fill: 'var(--chart-text)', fontWeight: 'bold', fontSize: 12 }} />
                          <RechartsTooltip contentStyle={{ backgroundColor: 'var(--chart-tooltip-bg)', color: 'var(--chart-tooltip-text)', border: 'none', borderRadius: '0', fontWeight: 'bold' }} itemStyle={{ color: 'var(--primary)' }} />
                          <Line type="monotone" dataKey="clicks" stroke="var(--chart-line)" strokeWidth={4} dot={{ strokeWidth: 2, r: 4, fill: 'var(--chart-line)' }} activeDot={{ r: 8 }} />
                        </LineChart>
                     </ResponsiveContainer>
                     )}
                   </div>
                </Flex>

                <Flex flexProps={{ vertical: true, className: "neo-brutal bg-[var(--secondary)] p-6 h-[300px] md:col-span-2" }}>
                   <Typography typographyProps={{ level: 5, className: "!text-sm !font-black !uppercase !mb-4" }}>
                      Device Usage
                   </Typography>
                   <div className="flex-grow w-full">
                     {mounted && (
                     <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={deviceData}>
                         <XAxis dataKey="name" stroke="var(--chart-text)" tick={{ fill: 'var(--chart-text)', fontWeight: 'bold', fontSize: 12 }} />
                         <YAxis stroke="var(--chart-text)" tick={{ fill: 'var(--chart-text)', fontWeight: 'bold', fontSize: 12 }} />
                         <RechartsTooltip contentStyle={{ backgroundColor: 'var(--chart-tooltip-bg)', color: 'var(--chart-tooltip-text)', border: 'none', fontWeight: 'bold' }} />
                         <Bar dataKey="value" fill="var(--chart-bar)" stroke="var(--border-default)" strokeWidth={2} />
                       </BarChart>
                     </ResponsiveContainer>
                     )}
                   </div>
                </Flex>

                <Flex flexProps={{ vertical: true, className: "neo-brutal bg-[var(--secondary)] p-6 h-[300px] md:col-span-1" }}>
                   <Typography typographyProps={{ level: 5, className: "!text-sm !font-black !uppercase !mb-4" }}>
                      Regions
                   </Typography>
                   <div className="flex-grow w-full">
                     {mounted && (
                     <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                         <Pie data={regionData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value" stroke="var(--border-default)" strokeWidth={2}>
                           {regionData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                           ))}
                         </Pie>
                         <RechartsTooltip contentStyle={{ backgroundColor: 'var(--chart-tooltip-bg)', color: 'var(--chart-tooltip-text)', border: 'none', fontWeight: 'bold' }} />
                       </PieChart>
                     </ResponsiveContainer>
                     )}
                   </div>
                </Flex>
              </div>
              )}
           </div>
        )}
      </Flex>
    </Modal>
  );
}
