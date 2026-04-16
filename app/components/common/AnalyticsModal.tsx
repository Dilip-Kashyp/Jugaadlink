"use client";
import React, { useEffect, useState } from "react";
import { Modal, Tooltip } from "antd";
import { Copy, Share2, QrCode, Trash2, BarChart as BarChartIcon, Map, Smartphone, Globe, X, TrendingUp } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, 
  LineChart, Line, CartesianGrid, PieChart, Pie, Cell 
} from "recharts";
import { Typography, Flex, Button } from "./index";
import Empty from "./Empty";
import { useUrlAnalytics, UrlItem } from "@/app/Services";
import { PIE_COLORS } from "@/app/constants";

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
  
  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [deviceData, setDeviceData] = useState<any[]>([]);
  const [regionData, setRegionData] = useState<any[]>([]);
  const [referrerData, setReferrerData] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const analyticsHandler = useUrlAnalytics({
    mutationConfig: {
      onSuccess: (res: any) => {
        const data = res?.data || res || {};
        setTimelineData(data.timeline || []);
        setDeviceData(data.devices || []);
        setRegionData(data.regions || []);
        setReferrerData(data.referrers || []);
      },
      onError: () => {
        setTimelineData([]);
        setDeviceData([]);
        setRegionData([]);
        setReferrerData([]);
      }
    }
  });

  useEffect(() => {
    if (open && selectedLink) {
        analyticsHandler.mutate(selectedLink.short_code || selectedLink.short_url);
    }
  }, [open, selectedLink]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={1000}
      className="premium-modal"
      rootClassName="[&_.ant-modal-content]:!p-0 [&_.ant-modal-content]:!bg-[var(--background)] [&_.ant-modal-close]:!hidden overflow-hidden"
    >
      <Flex vertical>
        {/* Header Strip */}
        <Flex 
          justify="space-between" 
          align="center" 
          className="p-8 border-b border-[var(--border-default)] bg-[var(--background-subtle)]"
        >
          <Flex vertical gap={4}>
            <div className="flex items-center gap-3">
               <div className="p-2.5 bg-[var(--primary-subtle)] rounded-xl text-[var(--primary)] shadow-sm">
                  <BarChartIcon size={22} />
               </div>
               <Typography.Title level={3} className="!font-black !m-0 !tracking-tight !text-3xl">
                 Performance Analytics
               </Typography.Title>
            </div>
            {selectedLink && (
              <span className="text-xs font-bold text-[var(--foreground-subtle)] font-mono pl-12 truncate max-w-md opacity-70">
                {selectedLink.short_url}
              </span>
            )}
          </Flex>

          <Flex align="center" gap={12}>
            {selectedLink && (
              <div className="flex items-center gap-1 bg-[var(--background-muted)] p-1.5 rounded-2xl border border-[var(--border-default)]">
                <Tooltip title="Copy Link">
                  <Button type="text" shape="circle" onClick={() => onCopy(selectedLink.short_url)} icon={<Copy size={18} />} />
                </Tooltip>
                <Tooltip title="QR Code">
                  <Button type="text" shape="circle" onClick={() => onQrCode(selectedLink.short_url)} icon={<QrCode size={18} />} />
                </Tooltip>
                <Tooltip title="Delete Permanently">
                   <Button type="text" shape="circle" onClick={() => { onDelete(selectedLink.short_url); onClose(); }} icon={<Trash2 size={18} />} danger />
                </Tooltip>
              </div>
            )}
            <Button onClick={onClose} type="text" shape="circle" className="hover:!bg-[var(--background-muted)]" icon={<X size={20} />} />
          </Flex>
        </Flex>

        {/* Content Area */}
        {selectedLink && (
           <div className="p-10 max-h-[75vh] overflow-y-auto bg-[var(--background)]">
              
              {/* Highlight Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                  <div className="premium-card !p-8">
                    <Typography.Text className="!text-[11px] !font-black !uppercase !tracking-widest !text-[var(--foreground-subtle)] !mb-3 !block">
                       Total Engagement
                    </Typography.Text>
                    <Typography.Title level={2} className="!text-6xl !font-black !m-0 !tracking-[0.02em]">
                       {selectedLink.clicks}
                    </Typography.Title>
                  </div>
                  <div className="premium-card !p-8 md:col-span-2">
                    <Typography.Text className="!text-[11px] !font-black !uppercase !tracking-widest !text-[var(--foreground-subtle)] !mb-3 !block">
                       Destination Profile
                    </Typography.Text>
                    <div className="flex items-center gap-3">
                       <Globe size={20} className="text-[var(--primary)]" />
                       <span className="text-lg font-bold text-[var(--foreground)] truncate max-w-md">{selectedLink.original_url}</span>
                    </div>
                  </div>
              </div>
              
              {selectedLink.clicks === 0 ? (
                 <div className="py-20 bg-white rounded-3xl border border-dashed border-slate-200 flex flex-col items-center">
                   <Empty description="Awaiting first engagement pulse..." />
                 </div>
              ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Traffic Trend */}
                 <div className="premium-card !p-8 lg:col-span-3">
                    <Typography.Text className="!text-xs !font-black !uppercase !tracking-[0.15em] !text-[var(--foreground-subtle)] !mb-10 !flex !items-center !gap-2">
                       <TrendingUp size={14}/> Engagement Trend
                    </Typography.Text>
                   <div className="h-[280px] w-full">
                      {mounted && (
                      <ResponsiveContainer width="100%" height="100%">
                         <LineChart data={timelineData}>
                           <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--chart-grid)" />
                           <XAxis 
                               dataKey="name" 
                               axisLine={false} 
                               tickLine={false} 
                               tick={{ fill: 'var(--foreground-subtle)', fontWeight: 600, fontSize: 10 }}
                           />
                           <YAxis 
                               axisLine={false} 
                               tickLine={false} 
                               tick={{ fill: 'var(--foreground-subtle)', fontWeight: 600, fontSize: 10 }} 
                           />
                           <RechartsTooltip 
                               contentStyle={{ 
                                   backgroundColor: 'var(--background-subtle)',
                                   borderRadius: '16px', 
                                   border: '1px solid var(--border-default)', 
                                   boxShadow: 'var(--shadow-premium-lg)',
                                   color: 'var(--foreground)'
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
                </div>

                {/* Referrers */}
                 <div className="premium-card !p-8 lg:col-span-2">
                    <Typography.Text className="!text-xs !font-black !uppercase !tracking-[0.15em] !text-[var(--foreground-subtle)] !mb-10 !flex !items-center !gap-2">
                       <Globe size={14}/> Referral Sources
                    </Typography.Text>
                   <div className="h-[220px] w-full">
                      {mounted && (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={referrerData} layout="vertical">
                          <XAxis type="number" hide />
                          <YAxis 
                             type="category" 
                             dataKey="name" 
                             width={120}
                             axisLine={false} 
                             tickLine={false} 
                             tick={{ fill: 'var(--foreground-muted)', fontWeight: 700, fontSize: 11 }}
                          />
                          <RechartsTooltip 
                             contentStyle={{ 
                                backgroundColor: 'var(--background-subtle)',
                                borderRadius: '12px', 
                                border: '1px solid var(--border-default)',
                                color: 'var(--foreground)'
                             }} 
                          />
                          <Bar dataKey="value" fill="var(--chart-bar)" radius={[0, 6, 6, 0]} barSize={24} />
                        </BarChart>
                      </ResponsiveContainer>
                      )}
                   </div>
                </div>

                {/* Region Distro */}
                 <div className="premium-card !p-8">
                    <Typography.Text className="!text-xs !font-black !uppercase !tracking-[0.15em] !text-[var(--foreground-subtle)] !mb-6 !flex !items-center !gap-2">
                       <Map size={14}/> Geographic Reach
                    </Typography.Text>
                   <div className="h-[220px] w-full">
                      {mounted && (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie 
                            data={regionData} 
                            cx="50%" 
                            cy="50%" 
                            innerRadius={60} 
                            outerRadius={80} 
                            paddingAngle={8} 
                            dataKey="value" 
                            stroke="none"
                          >
                            {regionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip 
                             contentStyle={{ 
                                backgroundColor: 'var(--background-subtle)',
                                borderRadius: '12px', 
                                border: '1px solid var(--border-default)' 
                             }} 
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      )}
                   </div>
                </div>

                {/* Device Distro */}
                 <div className="premium-card !p-8 lg:col-span-3">
                    <Typography.Text className="!text-xs !font-black !uppercase !tracking-[0.15em] !text-[var(--foreground-subtle)] !mb-10 !flex !items-center !gap-2">
                       <Smartphone size={14}/> Experience Breakdown
                    </Typography.Text>
                   <div className="h-[140px] w-full">
                      {mounted && (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={deviceData} margin={{ top: 0, bottom: 0 }}>
                          <XAxis 
                             dataKey="name" 
                             axisLine={false} 
                             tickLine={false} 
                             tick={{ fill: 'var(--foreground-subtle)', fontWeight: 700, fontSize: 10 }} 
                          />
                          <YAxis hide />
                          <RechartsTooltip 
                             cursor={{ fill: 'var(--background-muted)', opacity: 0.4 }} 
                             contentStyle={{ 
                                backgroundColor: 'var(--background-subtle)',
                                borderRadius: '12px', 
                                border: '1px solid var(--border-default)' 
                             }} 
                          />
                          <Bar dataKey="value" fill="var(--accent-gold)" radius={[6, 6, 0, 0]} barSize={48} />
                        </BarChart>
                      </ResponsiveContainer>
                      )}
                   </div>
                </div>
              </div>
              )}
           </div>
        )}
      </Flex>
    </Modal>
  );
}
