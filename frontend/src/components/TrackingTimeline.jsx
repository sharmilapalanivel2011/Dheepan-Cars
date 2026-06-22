import React from "react"
import "./TrackingTimeline.css"

const STEPS = [
  { label: "Order Placed",     icon: "📋" },
  { label: "Processing",       icon: "⚙️" },
  { label: "Shipped",          icon: "🚚" },
  { label: "Out for Delivery", icon: "📦" },
  { label: "Delivered",        icon: "✅" },
]

function TrackingTimeline({ currentStatus, statusHistory = [] }) {
  const isCancelled = currentStatus === "Cancelled"
  const currentIndex = isCancelled ? -1 : STEPS.findIndex(s => s.label === currentStatus)

  return (
    <div className="timeline-wrapper">

      {isCancelled ? (
        <div className="cancelled-box">
          ❌ This order has been cancelled.
        </div>
      ) : (
        <div className="timeline-steps">
          {STEPS.map((step, index) => {
            const isCompleted = index < currentIndex
            const isActive    = index === currentIndex
            return (
              <div key={step.label} className={`t-step ${isCompleted ? "completed" : ""} ${isActive ? "active" : ""}`}>
                <div className="t-circle">
                  {isCompleted ? "✓" : step.icon}
                </div>
                <p className="t-label">{step.label}</p>
              </div>
            )
          })}
        </div>
      )}

      {statusHistory.length > 0 && (
        <div className="history-box">
          <h4>Status History</h4>
          {[...statusHistory].reverse().map((entry, i) => (
            <div key={i} className="history-row">
              <span className="h-status">{entry.status}</span>
              <span className="h-time">{new Date(entry.timestamp).toLocaleString()}</span>
              {entry.note && <span className="h-note">{entry.note}</span>}
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default TrackingTimeline