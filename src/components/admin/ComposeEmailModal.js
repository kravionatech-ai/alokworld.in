"use client";

import { useState } from "react";

export default function ComposeEmailModal({
  isOpen,
  onClose,
  members = [],
  onEmailDispatched,
  adminLang = "hi",
}) {
  const isHi = adminLang === "hi";

  const [recipientType, setRecipientType] = useState("direct"); // "direct" | "member"
  const [recipientEmail, setRecipientEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [templateName, setTemplateName] = useState("general");
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const templates = {
    general: {
      subject: isHi ? "अखिल भारतीय लोधी अधिकारी-कर्मचारी संघ — आधिकारिक सूचना" : "Official Notification — alokworld.in",
      body: isHi
        ? `सादर जय भारत,\n\nअखिल भारतीय लोधी अधिकारी-कर्मचारी संघ (आलोक) के केंद्रीय सचिवालय की ओर से सादर प्रणाम।\n\n[यहाँ अपना मुख्य संदेश / सूचना का विवरण लिखें]\n\nअधिक जानकारी हेतु वेबसाइट alokworld.in पर पधारें।\n\nसस्नेह,\nकेंद्रीय सचिवालय\nअखिल भारतीय लोधी अधिकारी-कर्मचारी संघ (आलोक)`
        : `Dear Member,\n\nGreetings from the Central Secretariat of Akhil Bhartiya Lodhi Adhikari-Karmachari Sangh (alokworld.in).\n\n[Enter your message details here]\n\nSincerely,\nCentral Secretariat\nalokworld.in`,
    },
    convention2026: {
      subject: isHi ? "आलोक पंचम राष्ट्रीय महाधिवेशन 2026 — विशेष आमंत्रण पत्र" : "Alok 5th National Convention 2026 — Official Invitation",
      body: isHi
        ? `सादर जय भारत,\n\nअत्यंत हर्ष के साथ सूचित किया जाता है कि अखिल भारतीय लोधी अधिकारी-कर्मचारी संघ (आलोक) का पंचम राष्ट्रीय महाधिवेशन एवं राष्ट्रीय प्रतिभा सम्मान समारोह आगामी 2 नवंबर 2026 को कांस्टीट्यूशन क्लब, रफी मार्ग, नई दिल्ली में आयोजित हो रहा है।\n\nइस गरिमामय राष्ट्रीय समागम में आप सपरिवार सादर आमंत्रित हैं। कृपया अपनी उपस्थिति सुनिश्चित करें।\n\nस्थान: डिप्टी स्पीकर हॉल, कांस्टीट्यूशन क्लब, नई दिल्ली\nदिनांक: 2 नवंबर 2026\n\nसस्नेह,\nकेंद्रीय सचिवालय\nalokworld.in`
        : `Dear Member,\n\nWe cordially invite you to the 5th National Convention & Talent Felicitation Ceremony 2026 on 2 November 2026 at the Constitution Club of India, Rafi Marg, New Delhi.\n\nDate: 2 November 2026\nVenue: Constitution Club of India, New Delhi\n\nSincerely,\nCentral Secretariat\nalokworld.in`,
    },
    membership: {
      subject: isHi ? "लोधी समाज निर्देशिका — सदस्यता विवरण एवं सत्यापन" : "Lodhi Samaj Directory — Membership Verification",
      body: isHi
        ? `सादर जय भारत,\n\nअखिल भारतीय लोधी समाज निर्देशिका (alokworld.in) में आपके पंजीकरण और सहयोग हेतु हृदय से धन्यवाद। आपके सदस्यता रिकॉर्ड का अद्यतनीकरण पूरा कर लिया गया है।\n\nकृपया पोर्टल पर जाकर अपने विवरण का अवलोकन करें एवं किसी भी संशोधन हेतु सचिवालय को सूचित करें।\n\nसस्नेह,\nकेंद्रीय सचिवालय\nalokworld.in`
        : `Dear Member,\n\nThank you for your registration with the All India Lodhi Samaj Directory (alokworld.in). Your profile details have been reviewed.\n\nSincerely,\nCentral Secretariat\nalokworld.in`,
    },
  };

  const handleApplyTemplate = (key) => {
    setTemplateName(key);
    if (templates[key]) {
      setSubject(templates[key].subject);
      setMessage(templates[key].body);
    }
  };

  const handleMemberSelect = (e) => {
    const memId = e.target.value;
    if (!memId) return;
    const member = members.find((m) => String(m._id || m.id) === String(memId));
    if (member && member.email) {
      setRecipientEmail(member.email);
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!recipientEmail.trim() || !subject.trim() || !message.trim() || isSending) return;

    setIsSending(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/admin/emails/compose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientEmail: recipientEmail.trim(),
          subject: subject.trim(),
          message: message.trim(),
          templateName,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to dispatch email.");
      }

      setSuccessMsg(isHi ? `ईमेल सफलतापूर्वक ${recipientEmail} को प्रेषित किया गया!` : `Email successfully dispatched to ${recipientEmail}!`);
      if (onEmailDispatched) onEmailDispatched();

      setTimeout(() => {
        onClose();
      }, 1400);
    } catch (err) {
      setErrorMsg(err.message || "Failed to dispatch email");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0D1B2A]/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl border border-[#D5CEC4] flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="bg-[#091D42] text-white px-5 py-3.5 border-b border-[#F26A21] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">✉️</span>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">
                {isHi ? "नया आधिकारिक ईमेल तैयार करें" : "Compose Official Outbound Email"}
              </h3>
              <p className="text-[11px] text-[#CBD5E1]">
                {isHi
                  ? "Resend ट्रांसैक्शनल इंजन द्वारा सीधे प्राप्तकर्ता के इनबॉक्स में प्रेषित होगा"
                  : "Dispatches directly to recipient inbox via Resend transactional engine"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSendEmail} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 text-xs">
          {errorMsg && (
            <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded font-medium">
              ⚠️ {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded font-medium">
              ✅ {successMsg}
            </div>
          )}

          {/* Recipient Selection Mode */}
          <div className="space-y-1.5">
            <label className="block font-bold text-[#102F6B]">
              {isHi ? "प्राप्तकर्ता चुनें (Recipient Type):" : "Select Recipient:"}
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRecipientType("direct")}
                className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer border ${
                  recipientType === "direct"
                    ? "bg-[#102F6B] text-white border-[#102F6B]"
                    : "bg-[#FAF8F3] text-[#55657E] border-[#D5CEC4]"
                }`}
              >
                {isHi ? "सीधे ईमेल पता लिखें" : "Enter Email Address"}
              </button>
              <button
                type="button"
                onClick={() => setRecipientType("member")}
                className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer border ${
                  recipientType === "member"
                    ? "bg-[#102F6B] text-white border-[#102F6B]"
                    : "bg-[#FAF8F3] text-[#55657E] border-[#D5CEC4]"
                }`}
              >
                {isHi ? "पंजीकृत सदस्य सूची से चुनें" : "Select from Members Directory"}
              </button>
            </div>

            {recipientType === "member" ? (
              <select
                onChange={handleMemberSelect}
                className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded text-xs focus:border-[#102F6B] outline-hidden mt-1.5"
              >
                <option value="">
                  {isHi ? "-- सदस्य का चयन करें --" : "-- Select a member from directory --"}
                </option>
                {members
                  .filter((m) => Boolean(m.email))
                  .map((m) => (
                    <option key={m._id || m.id} value={m._id || m.id}>
                      {m.fullName || m.name} ({m.designation || "सदस्य"}) — {m.email}
                    </option>
                  ))}
              </select>
            ) : null}

            <input
              type="email"
              required
              placeholder="example@gmail.com"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded text-xs font-mono focus:border-[#102F6B] outline-hidden mt-1"
            />
          </div>

          {/* Preset Templates */}
          <div className="space-y-1">
            <label className="block font-bold text-[#102F6B]">
              {isHi ? "टेम्पलेट का चयन (Pre-built Community Templates):" : "Pre-built Templates:"}
            </label>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => handleApplyTemplate("general")}
                className="px-2.5 py-1 bg-[#FAF8F3] hover:bg-[#102F6B] hover:text-white border border-[#D5CEC4] rounded text-[11px] font-medium cursor-pointer"
              >
                📢 {isHi ? "सामान्य आधिकारिक सूचना" : "General Notice"}
              </button>
              <button
                type="button"
                onClick={() => handleApplyTemplate("convention2026")}
                className="px-2.5 py-1 bg-[#FAF8F3] hover:bg-[#102F6B] hover:text-white border border-[#D5CEC4] rounded text-[11px] font-medium cursor-pointer"
              >
                🏛️ {isHi ? "अधिवेशन 2026 विशेष आमंत्रण" : "Convention 2026 Invite"}
              </button>
              <button
                type="button"
                onClick={() => handleApplyTemplate("membership")}
                className="px-2.5 py-1 bg-[#FAF8F3] hover:bg-[#102F6B] hover:text-white border border-[#D5CEC4] rounded text-[11px] font-medium cursor-pointer"
              >
                📜 {isHi ? "सदस्यता सत्यापन संदेश" : "Membership Welcome"}
              </button>
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-1">
            <label className="block font-bold text-[#102F6B]">
              {isHi ? "ईमेल विषय (Subject Line):" : "Email Subject:"}
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={isHi ? "ईमेल का विषय दर्ज करें..." : "Enter subject..."}
              className="w-full px-2.5 py-1.5 border border-[#D5CEC4] bg-white rounded text-xs focus:border-[#102F6B] outline-hidden font-medium"
            />
          </div>

          {/* Message Body */}
          <div className="space-y-1">
            <label className="block font-bold text-[#102F6B]">
              {isHi ? "संदेश विवरण (Email Message Body):" : "Message Body:"}
            </label>
            <textarea
              required
              rows={7}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={isHi ? "अपना संदेश यहाँ लिखें..." : "Enter message body..."}
              className="w-full px-3 py-2 border border-[#D5CEC4] bg-white rounded text-xs focus:border-[#102F6B] outline-hidden leading-relaxed font-sans"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-[#E2DDD5]">
            <span className="text-[11px] text-[#64748B]">
              प्रेषक: <code className="font-mono text-[#102F6B]">contact@alokworld.in</code>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 border border-[#D5CEC4] rounded text-[#55657E] hover:text-[#1E293B] cursor-pointer"
              >
                {isHi ? "रद्द करें" : "Cancel"}
              </button>
              <button
                type="submit"
                disabled={isSending || !recipientEmail.trim() || !subject.trim()}
                className="px-4 py-1.5 bg-[#102F6B] hover:bg-[#091D42] disabled:opacity-50 text-white font-bold rounded shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <span>{isSending ? (isHi ? "प्रेषित कर रहे हैं..." : "Dispatching...") : (isHi ? "ईमेल प्रेषित करें ✉️" : "Dispatch Email ✉️")}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
