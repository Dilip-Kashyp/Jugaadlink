"use client";
import React, { useEffect, useState, memo } from "react";
import { Modal, Tooltip } from "antd";
import { Copy, Share2, QrCode, Trash2, BarChart as BarChartIcon, Map, Smartphone, Globe, X, TrendingUp } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, PieChart, Pie, Cell
} from "recharts";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { Typography, Flex, Button } from "./index";
import Empty from "./Empty";
import { useUrlAnalytics, UrlItem } from "@/app/Services";
import { PIE_COLORS } from "@/app/constants";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Normalize country names for fuzzy matching between backend data and TopoJSON geo names
const COUNTRY_ALIASES: Record<string, string[]> = {
  "United States": ["United States of America", "USA", "US"],
  "United Kingdom": ["U.K.", "UK", "Great Britain", "England"],
  "South Korea": ["Korea, Republic of", "Republic of Korea", "S. Korea"],
  "Czech Republic": ["Czechia"],
  "Russia": ["Russian Federation"],
};

function matchCountry(geoName: string, dataName: string): boolean {
  if (!geoName || !dataName) return false;
  const gn = geoName.toLowerCase().trim();
  const dn = dataName.toLowerCase().trim();
  if (gn === dn) return true;
  // Check aliases
  const aliases = COUNTRY_ALIASES[dataName];
  if (aliases && aliases.some(a => a.toLowerCase() === gn)) return true;
  // Partial match
  if (gn.includes(dn) || dn.includes(gn)) return true;
  return false;
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

// Color scale: light blue → indigo → purple based on intensity
function getHeatColor(intensity: number): string {
  // intensity 0..1 → hue from 220 (blue) to 270 (purple), saturation 80-100%, lightness 70 down to 45
  const hue = 220 + intensity * 50;
  const sat = 80 + intensity * 20;
  const light = 70 - intensity * 25;
  return `hsl(${hue}, ${sat}%, ${light}%)`;
}

export const WorldMapChart = memo(({ regionData }: { regionData: any[] }) => {
  const maxVal = Math.max(...regionData.map(r => Number(r.value) || 0), 1);

  const getCountryColor = (geo: any) => {
    const geoName = geo.properties?.name || "";
    const match = regionData.find(r => matchCountry(geoName, String(r.name || "")));
    if (!match) return "#1e293b"; // dark slate for empty countries
    const intensity = Math.max(0.15, Number(match.value) / maxVal);
    return getHeatColor(intensity);
  };

  const getTooltipContent = (geo: any) => {
    const geoName = geo.properties?.name || "";
    const match = regionData.find(r => matchCountry(geoName, String(r.name || "")));
    if (match) return `${match.name}: ${match.value} clicks`;
    return geoName;
  };

  return (
    <ComposableMap
      projectionConfig={{ rotate: [-10, 0, 0], scale: 147 }}
      width={800}
      height={400}
      style={{ width: "100%", height: "auto" }}
    >
      <ZoomableGroup>
        <Geographies geography={GEO_URL}>
          {({ geographies }: any) =>
            geographies.map((geo: any) => (
              <Tooltip key={geo.rsmKey} title={getTooltipContent(geo)}>
                <Geography
                  geography={geo}
                  fill={getCountryColor(geo)}
                  stroke="#334155"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#818cf8", outline: "none", cursor: "pointer" },
                    pressed: { outline: "none" },
                  }}
                />
              </Tooltip>
            ))
          }
        </Geographies>
      </ZoomableGroup>
    </ComposableMap>
  );
});
WorldMapChart.displayName = "WorldMapChart";

export default function AnalyticsModal({
  open, onClose, selectedLink, onCopy, onQrCode, onShare, onDelete
}: AnalyticsModalProps) {

  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [deviceData, setDeviceData] = useState<any[]>([]);
  const [regionData, setRegionData] = useState<any[]>([]);
  const [referrerData, setReferrerData] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

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
        setTimelineData([]); setDeviceData([]); setRegionData([]); setReferrerData([]);
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
      width="min(1000px, 95vw)"
      className="premium-modal custom-modal"
      classNames={{ body: "!p-0" }}
      styles={{ body: { padding: 0 } }}
      rootClassName="[&_.ant-modal-content]:!bg-[var(--background)] [&_.ant-modal-content]:!rounded-2xl [&_.ant-modal-content]:!overflow-hidden [&_.ant-modal-close]:!hidden"
    >
      <Flex vertical>
        <Flex justify="space-between" align="center" className="p-4 sm:p-8 border-b border-[var(--border-default)] bg-[var(--background-subtle)] flex-wrap gap-3">
          <Flex vertical gap={4} className="min-w-0 flex-1">
            <div className="flex items-center gap-2 sm:gap-3 m-3">
              <div className="p-2 sm:p-2.5 bg-[var(--primary-subtle)] rounded-xl text-[var(--primary)] shadow-sm flex-shrink-0">
                <BarChartIcon size={18} />
              </div>
              <Typography.Title level={3} className="!font-black !m-0 !tracking-tight !text-xl sm:!text-3xl">
                Performance Analytics
              </Typography.Title>
            </div>
            {selectedLink && (
              <span className="text-xs font-bold text-[var(--foreground-subtle)] font-mono pl-9 sm:pl-12 truncate max-w-[200px] sm:max-w-md opacity-70">
                {selectedLink.short_url}
              </span>
            )}
          </Flex>
          <Flex align="center" gap={8} className="flex-shrink-0">
            {selectedLink && (
              <div className="flex items-center gap-1 bg-[var(--background-muted)] p-1 sm:p-1.5 rounded-2xl border border-[var(--border-default)]">
                <Tooltip title="Copy Link"><Button type="text" shape="circle" onClick={() => onCopy(selectedLink.short_url)} icon={<Copy size={16} />} /></Tooltip>
                <Tooltip title="QR Code"><Button type="text" shape="circle" onClick={() => onQrCode(selectedLink.short_url)} icon={<QrCode size={16} />} /></Tooltip>
                <Tooltip title="Delete"><Button type="text" shape="circle" onClick={() => { onDelete(selectedLink.short_url); onClose(); }} icon={<Trash2 size={16} />} danger /></Tooltip>
              </div>
            )}
            <Button onClick={onClose} type="text" shape="circle" className="hover:!bg-[var(--background-muted)]" icon={<X size={20} />} />
          </Flex>
        </Flex>

        {/* Content */}
        {selectedLink && (
          <div className="p-4 sm:p-10 max-h-[75vh] overflow-y-auto bg-[var(--background)]">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mb-6 sm:mb-10">
              <div className="bg-[var(--background-subtle)] border border-[var(--border-default)] rounded-2xl p-5 sm:p-8">
                <span className="text-[11px] font-black uppercase tracking-widest text-[var(--foreground-subtle)] mb-3 block">Total Engagement</span>
                <span className="text-4xl sm:text-6xl font-black tracking-tight block">{selectedLink.clicks}</span>
              </div>
              <div className="bg-[var(--background-subtle)] border border-[var(--border-default)] rounded-2xl p-5 sm:p-8 sm:col-span-2">
                <span className="text-[11px] font-black uppercase tracking-widest text-[var(--foreground-subtle)] mb-3 block">Destination</span>
                <div className="flex items-center gap-3">
                  <Globe size={20} className="text-[var(--primary)] flex-shrink-0" />
                  <span className="text-base sm:text-lg font-bold text-[var(--foreground)] truncate">{selectedLink.original_url}</span>
                </div>
              </div>
            </div>

            {selectedLink.clicks === 0 ? (
              <div className="py-20 bg-[var(--background-subtle)] rounded-2xl border border-dashed border-[var(--border-default)] flex flex-col items-center">
                <Empty description="Waiting for first click..." />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Traffic Trend */}
                <div className="bg-[var(--background-subtle)] border border-[var(--border-default)] rounded-2xl p-8 lg:col-span-3">
                  <span className="text-xs font-black uppercase tracking-[0.15em] text-[var(--foreground-subtle)] mb-10 flex items-center gap-2">
                    <TrendingUp size={14}/> Engagement Trend
                  </span>
                  <div className="h-[280px] w-full">
                    {mounted && (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={timelineData}>
                          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--chart-grid)" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--foreground-subtle)', fontWeight: 600, fontSize: 10 }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--foreground-subtle)', fontWeight: 600, fontSize: 10 }} />
                          <RechartsTooltip contentStyle={{ backgroundColor: 'var(--background-subtle)', borderRadius: '16px', border: '1px solid var(--border-default)', color: 'var(--foreground)' }} />
                          <Line type="monotone" dataKey="clicks" stroke="var(--primary)" strokeWidth={4} dot={false} activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--primary)' }} />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                {/* World Map */}
                <div className="bg-[var(--background-subtle)] border border-[var(--border-default)] rounded-2xl p-8 lg:col-span-3">
                  <span className="text-xs font-black uppercase tracking-[0.15em] text-[var(--foreground-subtle)] mb-6 flex items-center gap-2">
                    <Map size={14}/> Geographic Heatmap
                  </span>
                  <div className="rounded-xl overflow-hidden bg-[var(--background)] border border-[var(--border-default)]">
                    {mounted && <WorldMapChart regionData={regionData} />}
                  </div>
                  {/* Country legend */}
                  <div className="flex flex-wrap gap-3 mt-4">
                    {regionData.slice(0, 8).map((r, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-[var(--background)] rounded-full border border-[var(--border-default)]">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getHeatColor(Math.max(0.15, Number(r.value) / Math.max(...regionData.map(x => Number(x.value) || 0), 1))) }} />
                        <span className="text-xs font-semibold text-[var(--foreground-muted)]">{r.name}</span>
                        <span className="text-xs font-black text-[var(--foreground)]">{r.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Referrers */}
                <div className="bg-[var(--background-subtle)] border border-[var(--border-default)] rounded-2xl p-8 lg:col-span-2">
                  <span className="text-xs font-black uppercase tracking-[0.15em] text-[var(--foreground-subtle)] mb-10 flex items-center gap-2">
                    <Globe size={14}/> Referral Sources
                  </span>
                  <div className="h-[220px] w-full">
                    {mounted && (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={referrerData} layout="vertical">
                          <XAxis type="number" hide />
                          <YAxis type="category" dataKey="name" width={120} axisLine={false} tickLine={false} tick={{ fill: 'var(--foreground-muted)', fontWeight: 700, fontSize: 11 }} />
                          <RechartsTooltip contentStyle={{ backgroundColor: 'var(--background-subtle)', borderRadius: '12px', border: '1px solid var(--border-default)', color: 'var(--foreground)' }} />
                          <Bar dataKey="value" fill="var(--primary)" radius={[0, 6, 6, 0]} barSize={24} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                {/* Device */}
                <div className="bg-[var(--background-subtle)] border border-[var(--border-default)] rounded-2xl p-8">
                  <span className="text-xs font-black uppercase tracking-[0.15em] text-[var(--foreground-subtle)] mb-6 flex items-center gap-2">
                    <Smartphone size={14}/> Devices
                  </span>
                  <div className="h-[220px] w-full">
                    {mounted && (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={deviceData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value" stroke="none">
                            {deviceData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip contentStyle={{ backgroundColor: 'var(--background-subtle)', borderRadius: '12px', border: '1px solid var(--border-default)' }} />
                        </PieChart>
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
