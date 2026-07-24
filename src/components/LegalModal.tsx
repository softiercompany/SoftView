import React, { useState } from 'react';
import { Shield, FileText, Globe, X, ExternalLink, Lock, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LegalModalProps {
  isOpen: boolean;
  initialTab?: 'privacy' | 'terms' | 'oauth';
  onClose: () => void;
}

export default function LegalModal({ isOpen, initialTab = 'oauth', onClose }: LegalModalProps) {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'oauth'>(initialTab);

  if (!isOpen) return null;

  const appDomain = "softview.vercel.app";
  const homePageUrl = `https://${appDomain}`;
  const privacyUrl = `https://${appDomain}/privacy`;
  const termsUrl = `https://${appDomain}/terms`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-[#0b0e21] border border-white/10 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl text-white flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#070917]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
              <Shield className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Google OAuth & Legal Documentation</h2>
              <p className="text-xs text-gray-400">Authorized Domain & App Verification Info</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 bg-[#0d1026] px-5 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('oauth')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'oauth'
                ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500'
                : 'text-gray-400 hover:text-white border-transparent'
            }`}
          >
            <Globe className="w-4 h-4" />
            Google OAuth Consent URLs
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'privacy'
                ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500'
                : 'text-gray-400 hover:text-white border-transparent'
            }`}
          >
            <Lock className="w-4 h-4" />
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'terms'
                ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500'
                : 'text-gray-400 hover:text-white border-transparent'
            }`}
          >
            <FileText className="w-4 h-4" />
            Terms of Service
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-sm text-gray-300">
          {activeTab === 'oauth' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs leading-relaxed text-indigo-200">
                To protect you and your users, Google only allows apps using OAuth to use Authorized Domains. Below is the exact information required for your Google Cloud Console OAuth consent screen:
              </div>

              {/* 1. App Domain */}
              <div className="space-y-1.5 p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Authorized App Domain</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-md font-bold">Verified</span>
                </div>
                <div className="flex items-center justify-between bg-[#060814] p-2.5 rounded-lg border border-white/10 text-xs font-mono text-white">
                  <span>{appDomain}</span>
                  <a href={homePageUrl} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                    Visit <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* 2. Application Home Page */}
              <div className="space-y-1.5 p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Application Home Page Link</span>
                <p className="text-xs text-gray-400">Provide users a link to your home page:</p>
                <div className="flex items-center justify-between bg-[#060814] p-2.5 rounded-lg border border-white/10 text-xs font-mono text-white">
                  <span>{homePageUrl}</span>
                  <a href={homePageUrl} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                    Open <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* 3. Application Privacy Policy Link */}
              <div className="space-y-1.5 p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Application Privacy Policy Link</span>
                <p className="text-xs text-gray-400">Provide users a link to your public privacy policy:</p>
                <div className="flex items-center justify-between bg-[#060814] p-2.5 rounded-lg border border-white/10 text-xs font-mono text-white">
                  <span>{privacyUrl}</span>
                  <button onClick={() => setActiveTab('privacy')} className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                    View Policy <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* 4. Application Terms of Service Link */}
              <div className="space-y-1.5 p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Application Terms of Service Link</span>
                <p className="text-xs text-gray-400">Provide users a link to your public terms of service:</p>
                <div className="flex items-center justify-between bg-[#060814] p-2.5 rounded-lg border border-white/10 text-xs font-mono text-white">
                  <span>{termsUrl}</span>
                  <button onClick={() => setActiveTab('terms')} className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                    View Terms <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4 text-xs leading-relaxed text-gray-300">
              <h3 className="text-base font-bold text-white">SoftView Public Privacy Policy</h3>
              <p className="text-gray-400">Effective Date: July 2026 | Domain: softview.vercel.app</p>
              
              <h4 className="font-bold text-indigo-300 text-xs uppercase tracking-wider">1. Information We Collect</h4>
              <p>SoftView collects account information (such as Google OAuth profile name and email address), watch progress, video history, and learning preferences to customize AI recommendations.</p>

              <h4 className="font-bold text-indigo-300 text-xs uppercase tracking-wider">2. How We Use Information</h4>
              <p>We use collected data solely to deliver, improve, and secure SoftView services, maintain daily streaks, calculate level XP, and render smart video recommendations powered by Gemini AI.</p>

              <h4 className="font-bold text-indigo-300 text-xs uppercase tracking-wider">3. Google User Data</h4>
              <p>SoftView's use and transfer to any other app of information received from Google APIs will adhere to Google API Services User Data Policy, including the Limited Use requirements.</p>

              <h4 className="font-bold text-indigo-300 text-xs uppercase tracking-wider">4. Data Security</h4>
              <p>All sensitive user tokens and account information are encrypted using end-to-end security protocols and secure Supabase database rules.</p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-4 text-xs leading-relaxed text-gray-300">
              <h3 className="text-base font-bold text-white">SoftView Terms of Service</h3>
              <p className="text-gray-400">Effective Date: July 2026 | Domain: softview.vercel.app</p>

              <h4 className="font-bold text-indigo-300 text-xs uppercase tracking-wider">1. Acceptance of Terms</h4>
              <p>By accessing or using SoftView at softview.vercel.app, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>

              <h4 className="font-bold text-indigo-300 text-xs uppercase tracking-wider">2. User Account & Conduct</h4>
              <p>You are responsible for maintaining the confidentiality of your credentials and for all activities that occur under your account.</p>

              <h4 className="font-bold text-indigo-300 text-xs uppercase tracking-wider">3. Video & Content Licensing</h4>
              <p>Videos and courses available on SoftView are for educational and personal viewing. Unauthorized distribution is prohibited.</p>

              <h4 className="font-bold text-indigo-300 text-xs uppercase tracking-wider">4. Service Modifications</h4>
              <p>SoftView reserves the right to update features, daily trend refresh crons, and streak trackers to ensure optimal platform experience.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#070917] flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <CheckCircle className="w-4 h-4" />
            <span>Authorized Domain: softview.vercel.app</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
