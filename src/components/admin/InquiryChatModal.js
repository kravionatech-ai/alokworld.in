"use client";

import { useState, useEffect, useRef } from "react";

export default function InquiryChatModal({
  isOpen,
  onClose,
  inquiry,
  onInquiryUpdated,
  adminUser,
  adminLang = "hi",
}) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isNotifying, setIsNotifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [localInquiry, setLocalInquiry] = useState(inquiry);
  const chatBottomRef = useRef(null);

  const isHi = adminLang === "hi";

  useEffect(() => {
    if (inquiry) {
      setLocalInquiry(inquiry);
      setSubject(inquiry.subject ? `Re: ${inquiry.subject}` : "Re: Inquiry - alokworld.in");
      setMessage("");
      setErrorMsg("");
      setSuccessMsg("");
    }
  }, [inquiry]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    }
  }, [isOpen, localInquiry?.replies]);

  if (!isOpen || !localInquiry) return null;

  // Canned response templates
  const cannedTemplates = [
    {
      title: isHi ? "📋 प्राप्ति सूचना" : "Acknowledgement",
      text: `सादर जय भारत ${localInquiry.name || "जी"},\n\nअखिल भारतीय लोधी अधिकारी-कर्मचारी संघ (आलोक) के केंद्रीय सचिवालय को आपका संदेश प्राप्त हो गया है। आपके द्वारा संदर्भित विषय पर आवश्यक संज्ञान लिया जा रहा है और आवश्यकतानुसार शीघ्र ही आपसे संपर्क किया जाएगा।\n\nसस्नेह,\nकेंद्रीय सचिवालय\nalokworld.in`,
    },
    {
      title: isHi ? "🏛️ अधिवेशन 2026" : "Convention 2026",
      text: `सादर जय भारत ${localInquiry.name || "जी"},\n\nअखिल भारतीय लोधी अधिकारी-कर्मचारी संघ (आलोक) के पंचम राष्ट्रीय महाधिवेशन एवं प्रतिभा सम्मान समारोह में आपका स्वागत है। आगामी 2 नवंबर 2026 को कांस्टीट्यूशन क्लब, नई दिल्ली में आयोजित होने वाले इस राष्ट्रीय समागम की विस्तृत रूपरेखा शीघ्र ही वेबसाइट पर उपलब्ध होगी।\n\nसस्नेह,\nकेंद्रीय सचिवालय\nalokworld.in`,
    },
    {
      title: isHi ? "📜 सदस्यता दिशानिर्देश" : "Membership Info",
      text: `सादर जय भारत ${localInquiry.name || "जी"},\n\nअखिल भारतीय लोधी समाज निर्देशिका में पंजीकरण हेतु आपका आभार। संघ की सदस्यता नियमावली एवं सत्यापन प्रक्रिया के अनुसार आपके विवरण की जांच की जा रही है।\n\nसस्नेह,\nकेंद्रीय सचिवालय\nalokworld.in`,
    },
    {
      title: isHi ? "✅ समाधान एवं संपर्क" : "Resolution",
      text: `सादर जय भारत ${localInquiry.name || "जी"},\n\nआपके द्वारा पूछे गए प्रश्न के संबंध में हमारे सचिवालय ने आवश्यक जानकारी दर्ज कर ली है। यदि आपको अतिरिक्त जानकारी की आवश्यकता हो, तो आप इस ईमेल का उत्तर दे सकते हैं या सीधे संपर्क कर सकते हैं।\n\nसस्नेह,\nकेंद्रीय सचिवालय\nalokworld.in`,
    },
  ];

  const handleApplyTemplate = (tmplText) => {
    setMessage(tmplText);
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!message.trim() || !subject.trim() || isSending) return;

    setIsSending(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/admin/emails/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiryId: localInquiry._id || localInquiry.id,
          recipientEmail: localInquiry.email,
          subject: subject.trim(),
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to dispatch email reply.");
      }

      const newReply = {
        adminEmail: adminUser?.email || "admin@alokworld.in",
        subject: subject.trim(),
        message: message.trim(),
        sentAt: new Date().toISOString(),
        status: "sent",
        messageId: data.messageId || "",
      };

      const updated = {
        ...localInquiry,
        isRead: true,
        replies: [...(localInquiry.replies || []), newReply],
      };

      setLocalInquiry(updated);
      if (onInquiryUpdated) onInquiryUpdated(updated);

      setMessage("");
      setSuccessMsg(isHi ? "उत्तर ईमेल सफलतापूर्वक प्रेषित किया गया!" : "Email reply sent successfully!");
    } catch (err) {
      setErrorMsg(err.message || "Failed to send email");
    } finally {
      setIsSending(false);
    }
  };

  const handleTriggerNotification = async () => {
    if (isNotifying) return;
    setIsNotifying(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/admin/emails/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiryId: localInquiry._id || localInquiry.id,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send notification");

      const updated = {
        ...localInquiry,
        notificationStatus: "sent",
        confirmationStatus: "sent",
      };
      setLocalInquiry(updated);
      if (onInquiryUpdated) onInquiryUpdated(updated);

      setSuccessMsg(isHi ? "ईमेल सूचना एवं पुष्टि सफलतापूर्वक भेजी गई!" : "Notification & confirmation dispatched!");
    } catch (err) {
      setErrorMsg(err.message || "Notification failed");
    } finally {
      setIsNotifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0D1B2A]/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-2xl border border-[#D5CEC4] flex flex-col max-h-[92vh] overflow-hidden">
        {/* 1. Modal Header with Visitor Info */}
        <div className="bg-[#091D42] text-white px-4 sm:px-6 py-3.5 border-b border-[#F26A21] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-[#163A70] border border-[#F26A21] flex items-center justify-center text-sm font-bold shrink-0 text-amber-300">
              {localInquiry.name ? localInquiry.name.slice(0, 2).toUpperCase() : "AG"}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-sm sm:text-base text-white truncate">
                  {localInquiry.name}
                </h3>
                {localInquiry.phone && (
                  <span className="text-[11px] font-mono text-[#CBD5E1] bg-white/10 px-2 py-0.5 rounded">
                    📞 {localInquiry.phone}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-[#94A3B8] truncate mt-0.5">
                <a
                  href={`mailto:${localInquiry.email}`}
                  className="text-amber-300 hover:underline truncate"
                >
                  {localInquiry.email}
                </a>
                <span>•</span>
                <span>
                  {localInquiry.createdAt
                    ? new Date(localInquiry.createdAt).toLocaleString("en-IN")
                    : "Recent"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Notification Status Badge & 1-click Dispatch */}
            {localInquiry.notificationStatus === "sent" ? (
              <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 hidden sm:inline-block">
                {isHi ? "सूचना: प्रेषित ✓" : "Notification: Sent ✓"}
              </span>
            ) : (
              <button
                type="button"
                onClick={handleTriggerNotification}
                disabled={isNotifying}
                className="text-[10px] font-bold px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-600 text-slate-900 cursor-pointer shadow-xs transition-colors flex items-center gap-1"
                title="Send visitor & secretariat notification emails now"
              >
                <span>🔔</span>
                <span>{isNotifying ? (isHi ? "भेज रहे हैं..." : "Sending...") : (isHi ? "सूचना भेजें" : "Send Alert")}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 2. Chat Conversation Thread (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#FAF8F3]">
          {/* Status Message Alerts */}
          {errorMsg && (
            <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
              ⚠️ {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded">
              ✅ {successMsg}
            </div>
          )}

          {/* Visitor Incoming Message Bubble */}
          <div className="flex items-start gap-2.5 max-w-[88%]">
            <div className="w-8 h-8 rounded-full bg-[#102F6B] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
              {localInquiry.name ? localInquiry.name.slice(0, 1).toUpperCase() : "U"}
            </div>
            <div className="bg-white border border-[#E2DDD5] rounded-lg rounded-tl-none p-3.5 shadow-xs space-y-1.5 text-xs text-[#263449]">
              <div className="flex items-center justify-between gap-3 text-[10px] text-[#64748B] border-b border-[#F0E5D5] pb-1">
                <span className="font-bold text-[#102F6B]">{localInquiry.name} (आगंतुक/सदस्य)</span>
                <span>{localInquiry.createdAt ? new Date(localInquiry.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}</span>
              </div>
              <div className="font-bold text-[#102F6B] text-xs">
                {isHi ? "विषय:" : "Subject:"} {localInquiry.subject || "सामान्य पूछताछ"}
              </div>
              <p className="whitespace-pre-wrap leading-relaxed text-slate-800">
                {localInquiry.message}
              </p>
            </div>
          </div>

          {/* Admin Secretariat Replies Bubbles */}
          {Array.isArray(localInquiry.replies) && localInquiry.replies.length > 0 ? (
            localInquiry.replies.map((reply, idx) => (
              <div key={idx} className="flex items-start justify-end gap-2.5 ml-auto max-w-[88%]">
                <div className="bg-[#091D42] text-white border border-[#163A70] rounded-lg rounded-tr-none p-3.5 shadow-md space-y-1.5 text-xs">
                  <div className="flex items-center justify-between gap-4 text-[10px] text-slate-300 border-b border-white/10 pb-1">
                    <span className="font-bold text-amber-300">
                      {isHi ? "केंद्रीय सचिवालय उत्तर" : "Secretariat Official Reply"}
                    </span>
                    <span>
                      {reply.sentAt ? new Date(reply.sentAt).toLocaleString("en-IN") : ""}
                    </span>
                  </div>
                  {reply.subject && (
                    <div className="font-semibold text-slate-200 text-[11px]">
                      {reply.subject}
                    </div>
                  )}
                  <p className="whitespace-pre-wrap leading-relaxed text-slate-100">
                    {reply.message}
                  </p>
                  <div className="pt-1 flex items-center justify-between text-[10px] text-emerald-400">
                    <span>{reply.adminEmail || "admin@alokworld.in"}</span>
                    <span className="font-mono">ईमेल प्रेषित ✓ (Resend)</span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#F26A21] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
                  🏛️
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-2 text-[11px] text-[#8896AB]">
              {isHi
                ? "— इस संदेश का अभी तक कोई आधिकारिक उत्तर नहीं दिया गया है —"
                : "— No official reply dispatched yet for this inquiry —"}
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* 3. Quick Canned Templates Bar */}
        <div className="bg-[#F4EFE6] px-4 py-2 border-t border-[#E2DDD5] flex items-center gap-1.5 overflow-x-auto text-xs shrink-0">
          <span className="text-[10px] font-bold uppercase text-[#64748B] shrink-0">
            {isHi ? "त्वरित उत्तर:" : "Templates:"}
          </span>
          {cannedTemplates.map((t, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyTemplate(t.text)}
              className="px-2.5 py-1 bg-white hover:bg-[#102F6B] hover:text-white text-[#102F6B] border border-[#D5CEC4] rounded-full text-[11px] font-medium shrink-0 transition-colors cursor-pointer shadow-2xs"
            >
              {t.title}
            </button>
          ))}
        </div>

        {/* 4. Chat Input & Send Form */}
        <form onSubmit={handleSendReply} className="p-3 sm:p-4 bg-white border-t border-[#E2DDD5] space-y-2.5 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#102F6B] shrink-0">
              {isHi ? "विषय:" : "Subject:"}
            </span>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="flex-1 px-2.5 py-1 text-xs bg-[#FAF8F3] border border-[#D5CEC4] rounded focus:border-[#102F6B] outline-hidden text-[#1E293B]"
            />
          </div>

          <div className="relative">
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={isHi ? "अपना आधिकारिक उत्तर संदेश यहाँ लिखें (ईमेल द्वारा सीधे प्रेषित होगा)..." : "Type official reply message (dispatched via email)..."}
              className="w-full px-3 py-2 text-xs bg-white border border-[#D5CEC4] rounded focus:border-[#102F6B] outline-hidden text-[#1E293B] leading-relaxed resize-none"
            />
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="text-[11px] text-[#64748B] truncate">
              {isHi ? "उत्तर सीधे आगंतुक के ईमेल पर जाएगा:" : "Reply will be emailed directly to:"}{" "}
              <strong className="text-[#102F6B] font-mono">{localInquiry.email}</strong>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs text-[#55657E] hover:text-[#1E293B] cursor-pointer"
              >
                {isHi ? "बंद करें" : "Close"}
              </button>
              <button
                type="submit"
                disabled={isSending || !message.trim()}
                className="px-4 py-1.5 bg-[#102F6B] hover:bg-[#091D42] disabled:opacity-50 text-white font-bold text-xs rounded shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
              >
                <span>{isSending ? (isHi ? "भेज रहे हैं..." : "Sending...") : (isHi ? "ईमेल भेजें ✉️" : "Send Reply ✉️")}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
