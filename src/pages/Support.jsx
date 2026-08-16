import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, PhoneCall, Mail, MessageCircle } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";

const seedMessages = [
  { id: 1, from: "concierge", text: "Good evening! This is your AYLA concierge — how may I help you today?", time: "Just now" },
];

const autoReplies = [
  "Thank you for letting us know — I'll take care of that right away.",
  "I've noted your request and someone from our team will follow up shortly.",
  "Absolutely, that's no trouble at all. Anything else I can help with?",
  "Let me check on that for you — one moment, please.",
];

export default function Support() {
  const [messages, setMessages] = useState(seedMessages);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), from: "guest", text: input.trim(), time: "Just now" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const reply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
      setMessages((prev) => [...prev, { id: Date.now() + 1, from: "concierge", text: reply, time: "Just now" }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-ivory">
      <PageHeader eyebrow="We're Here for You" title="Customer Support" description="Chat with our concierge team, or reach us directly." />

      <div className="max-w-[1000px] mx-auto px-5 md:px-10 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
        {/* chat */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/60 border border-line rounded-[6px] flex flex-col h-[560px]"
        >
          <div className="flex items-center gap-3 px-6 py-4 border-b border-line">
            <div className="w-9 h-9 rounded-full bg-gold-deep/10 flex items-center justify-center">
              <MessageCircle size={16} className="text-gold-deep" />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-ink">AYLA Concierge</p>
              <p className="text-[11px] text-emerald-700">● Online now</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`max-w-[75%] px-4 py-2.5 rounded-[10px] text-[13.5px] leading-relaxed ${
                  m.from === "guest"
                    ? "self-end bg-ink text-ivory rounded-br-sm"
                    : "self-start bg-ivory-deep text-ink rounded-bl-sm"
                }`}
              >
                {m.text}
              </motion.div>
            ))}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={send} className="flex items-center gap-2 px-5 py-4 border-t border-line">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message…"
              className="flex-1 bg-ivory-deep/50 border border-line rounded-full px-4 py-2.5 text-[13.5px] outline-none focus:border-gold-deep transition-colors"
            />
            <button
              type="submit"
              aria-label="Send message"
              className="w-10 h-10 rounded-full bg-ink text-ivory flex items-center justify-center hover:bg-gold-deep transition-colors shrink-0"
            >
              <Send size={15} />
            </button>
          </form>
        </motion.div>

        {/* direct contact */}
        <div className="flex flex-col gap-4">
          <ContactCard icon={PhoneCall} title="Call Us" detail="+1 (800) 555-0192" note="Available 24/7" />
          <ContactCard icon={Mail} title="Email Us" detail="concierge@aylahospitality.com" note="Response within an hour" />
        </div>
      </div>
    </div>
  );
}

function ContactCard({ icon: Icon, title, detail, note }) {
  return (
    <div className="bg-ink text-ivory rounded-[4px] p-6">
      <Icon size={18} strokeWidth={1.6} className="text-gold-soft mb-4" />
      <h4 className="text-[14px] font-semibold mb-1">{title}</h4>
      <p className="text-[13px] text-ivory/75">{detail}</p>
      <p className="text-[11.5px] text-ivory/45 mt-1">{note}</p>
    </div>
  );
}
