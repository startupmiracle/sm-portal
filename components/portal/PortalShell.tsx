"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Globe,
  GraduationCap,
  LifeBuoy,
  LogOut,
  Menu,
  UsersRound,
  X,
} from "lucide-react";

const SM_LOGO_URL =
  "https://res.cloudinary.com/dy7cv4bih/image/upload/v1756175129/SM_-_logo-icon-transp_fhdqbi.png";

const NAV = [
  { href: "/workshops", label: "Workshops", icon: GraduationCap },
  { href: "/referrals", label: "Referrals", icon: UsersRound },
  { href: "/glossary", label: "Glossary", icon: BookOpen },
] as const;

export function PortalShell({
  children,
  title = "Customer Portal",
  subtitle,
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#faf9f5" }}>
      <header className="border-b border-zinc-200 bg-white sticky top-0 z-30">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="lg:hidden p-1.5 rounded-lg hover:bg-zinc-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Image src={SM_LOGO_URL} alt="Startup Miracle" width={32} height={32} className="rounded-lg" />
            <div>
              <div className="text-sm font-semibold text-zinc-900">{title}</div>
              {subtitle ? (
                <div className="text-xs text-zinc-500">{subtitle}</div>
              ) : (
                <div className="text-xs text-zinc-500">Startup Miracle</div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside
          className={`
          fixed inset-y-0 left-0 z-20 w-64 bg-white border-r border-zinc-200 pt-[57px] transform transition-transform duration-200
          lg:relative lg:translate-x-0 lg:pt-0
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        >
          <div className="p-4 space-y-1 overflow-y-auto h-[calc(100%-60px)] pb-4">
            <div className="text-xs text-zinc-400 uppercase tracking-wider font-medium px-3 pt-2 pb-1">
              Portal
            </div>
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                    active
                      ? "bg-emerald-50 text-emerald-700 font-medium"
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}

            <div className="h-px bg-zinc-100 my-3" />

            <div className="text-xs text-zinc-400 uppercase tracking-wider font-medium px-3 pt-1 pb-1">
              Get Help
            </div>
            <a
              href="mailto:javier@startupmiracle.com?subject=Technical Call"
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
            >
              <LifeBuoy className="w-4 h-4" />
              Technical Call
            </a>
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-white">
            <div className="mx-4 border-t border-zinc-100" />
            <div className="p-4 space-y-1">
              <a
                href="https://startupmiracle.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
              >
                <Globe className="w-4 h-4" />
                Startup Miracle
              </a>
              <a
                href="/auth/signout"
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-zinc-500 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </a>
            </div>
          </div>
        </aside>

        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-10 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <main className="flex-1 min-w-0 p-6 lg:p-10 max-w-5xl">{children}</main>
      </div>
    </div>
  );
}
