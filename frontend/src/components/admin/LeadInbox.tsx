"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import AdminCard from "@/src/components/admin/AdminCard";
import AdminStatusBadge from "@/src/components/admin/AdminStatusBadge";
import { adminButtonClassName } from "@/src/components/admin/AdminField";

type LeadStatus = "NEW" | "REVIEWED" | "CONTACTED" | "CLOSED";

type ProductNotificationItem = {
  id: string;
  email: string;
  source?: string | null;
  status: LeadStatus;
  createdAt?: string;
  product?: { title?: string; slug?: string; status?: string } | null;
};

type LeadInboxProps = {
  orderRequests: Array<{ id: string; name: string; email: string; phone?: string | null; notes?: string | null; status: LeadStatus; items?: Array<{ product?: { title?: string } }> }>;
  newsletterSubscriptions: Array<{ id: string; email: string; source?: string | null; status?: string; subscribedAt?: string }>;
  programReservations: Array<{ id: string; name: string; email: string; phone?: string | null; notes?: string | null; status: LeadStatus; program: { name: string } }>;
  retreatInquiries: Array<{ id: string; name: string; email: string; phone?: string | null; notes?: string | null; status: LeadStatus; retreat: { name: string } }>;
  productNotifications: ProductNotificationItem[];
};

const leadStatuses: LeadStatus[] = ["NEW", "REVIEWED", "CONTACTED", "CLOSED"];

export default function LeadInbox({
  orderRequests,
  newsletterSubscriptions,
  programReservations,
  retreatInquiries,
  productNotifications,
}: LeadInboxProps) {
  const [activeTab, setActiveTab] = useState<"orders" | "newsletter" | "programs" | "retreats" | "notify-me">("orders");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {[
          { key: "orders", label: `Order Requests (${orderRequests.length})` },
          { key: "newsletter", label: `Newsletter (${newsletterSubscriptions.length})` },
          { key: "programs", label: `Program Reservations (${programReservations.length})` },
          { key: "retreats", label: `Retreat Inquiries (${retreatInquiries.length})` },
          { key: "notify-me", label: `Notify Me (${productNotifications.length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`rounded-full px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] transition ${
              activeTab === tab.key ? "bg-[#2e4a36] text-[#f4efe8]" : "border border-[#cdbfae] bg-[#f8f2e8] text-[#3a3129]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "orders" ? <LeadStatusList title="Order Requests" items={orderRequests} endpoint="lead/order-requests" renderExtra={(item) => item.items?.map((entry) => entry.product?.title).filter(Boolean).join(", ")} /> : null}
      {activeTab === "newsletter" ? (
        <AdminCard>
          <h2 className="text-[24px]">Newsletter Subscribers</h2>
          <div className="mt-6 space-y-4">
            {newsletterSubscriptions.map((item) => (
              <div key={item.id} className="rounded-2xl border border-[#e2d7c7] bg-white px-4 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[15px] font-medium text-[#201b18]">{item.email}</p>
                    <p className="mt-2 text-[12px] uppercase tracking-[0.18em] text-[#7d7267]">{item.source || "Unknown source"}</p>
                  </div>
                  <AdminStatusBadge value={item.status || "SUBSCRIBED"} />
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      ) : null}
      {activeTab === "programs" ? <LeadStatusList title="Program Reservations" items={programReservations} endpoint="lead/program-reservations" renderExtra={(item) => item.program.name} /> : null}
      {activeTab === "retreats" ? <LeadStatusList title="Retreat Inquiries" items={retreatInquiries} endpoint="lead/retreat-inquiries" renderExtra={(item) => item.retreat.name} /> : null}
      {activeTab === "notify-me" ? <ProductNotificationList items={productNotifications} /> : null}
    </div>
  );
}

function ProductNotificationList({ items }: { items: ProductNotificationItem[] }) {
  const router = useRouter();
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <AdminCard>
      <h2 className="text-[24px]">Notify Me Signups</h2>
      {notice ? <p className="mt-5 rounded-2xl border border-[#cde0d2] bg-[#eef8f0] px-4 py-3 text-[14px] text-[#2c6541]">{notice}</p> : null}
      {error ? <p className="mt-5 rounded-2xl border border-[#e7c1ba] bg-[#fff1ee] px-4 py-3 text-[14px] text-[#9f4332]">{error}</p> : null}

      {items.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-[#e2d7c7] bg-white px-4 py-6 text-[14px] text-[#6c6157]">No Notify Me signups yet.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-[#e2d7c7] bg-white px-4 py-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <p className="text-[15px] font-medium text-[#201b18]">{item.email}</p>
                    <AdminStatusBadge value={item.status} />
                  </div>
                  {item.product?.title ? (
                    <p className="mt-2 text-[12px] uppercase tracking-[0.18em] text-[#7d7267]">
                      {item.product.title}
                      {item.product.status ? ` · ${item.product.status}` : ""}
                    </p>
                  ) : null}
                  {item.source ? (
                    <p className="mt-1 text-[12px] text-[#7d7267]">Source: {item.source}</p>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-2">
                  {leadStatuses.map((status) => (
                    <button
                      key={status}
                      type="button"
                      disabled={isPending || status === item.status}
                      className={`${adminButtonClassName} ${status === item.status ? "opacity-100" : "bg-[#f0e6d8] text-[#3a3129] hover:bg-[#e8dac7]"}`}
                      onClick={() => {
                        startTransition(async () => {
                          setNotice(null);
                          setError(null);
                          const response = await fetch(`/api/admin/proxy/lead/product-notifications/${item.id}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ status }),
                          });

                          const data = (await response.json().catch(() => null)) as { error?: string } | null;

                          if (!response.ok) {
                            setError(data?.error ?? "Unable to update status.");
                            return;
                          }

                          setNotice("Notification status updated.");
                          router.refresh();
                        });
                      }}
                    >
                      {status.replaceAll("_", " ")}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminCard>
  );
}

function LeadStatusList<T extends { id: string; name: string; email: string; phone?: string | null; notes?: string | null; status: LeadStatus }>({
  title,
  items,
  endpoint,
  renderExtra,
}: {
  title: string;
  items: T[];
  endpoint: string;
  renderExtra?: (item: T) => string | undefined;
}) {
  const router = useRouter();
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <AdminCard>
      <h2 className="text-[24px]">{title}</h2>
      {notice ? <p className="mt-5 rounded-2xl border border-[#cde0d2] bg-[#eef8f0] px-4 py-3 text-[14px] text-[#2c6541]">{notice}</p> : null}
      {error ? <p className="mt-5 rounded-2xl border border-[#e7c1ba] bg-[#fff1ee] px-4 py-3 text-[14px] text-[#9f4332]">{error}</p> : null}

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-[#e2d7c7] bg-white px-4 py-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <p className="text-[15px] font-medium text-[#201b18]">{item.name}</p>
                  <AdminStatusBadge value={item.status} />
                </div>
                <p className="mt-2 text-[13px] text-[#6c6157]">{item.email}</p>
                {item.phone ? <p className="mt-1 text-[13px] text-[#6c6157]">{item.phone}</p> : null}
                {renderExtra?.(item) ? <p className="mt-2 text-[12px] uppercase tracking-[0.18em] text-[#7d7267]">{renderExtra(item)}</p> : null}
                {item.notes ? <p className="mt-3 max-w-[60ch] text-[14px] leading-[1.8] text-[#5f574d]">{item.notes}</p> : null}
              </div>

              <div className="flex flex-wrap gap-2">
                {leadStatuses.map((status) => (
                  <button
                    key={status}
                    type="button"
                    disabled={isPending || status === item.status}
                    className={`${adminButtonClassName} ${status === item.status ? "opacity-100" : "bg-[#f0e6d8] text-[#3a3129] hover:bg-[#e8dac7]"}`}
                    onClick={() => {
                      startTransition(async () => {
                        setNotice(null);
                        setError(null);
                        const response = await fetch(`/api/admin/proxy/${endpoint}/${item.id}`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ status }),
                        });

                        const data = (await response.json().catch(() => null)) as { error?: string } | null;

                        if (!response.ok) {
                          setError(data?.error ?? "Unable to update status.");
                          return;
                        }

                        setNotice("Lead status updated.");
                        router.refresh();
                      });
                    }}
                  >
                    {status.replaceAll("_", " ")}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminCard>
  );
}
