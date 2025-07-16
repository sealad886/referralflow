
"use client";

import { AppLayout } from "@/components/app-layout";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";

// Placeholder for images - in a real app, these would be proper paths
const placeholderImage = (w: number, h: number) => `https://placehold.co/${w}x${h}.png`;

export default function HelpPage() {
  return (
    <AppLayout>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden" />
          <h1 className="font-semibold text-3xl">Help & User Guide</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Welcome to ReferralFlow</CardTitle>
            <CardDescription>
              This guide will walk you through the core features of the
              application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-lg">
                  1. Getting Started
                </AccordionTrigger>
                <AccordionContent className="prose prose-sm max-w-none dark:prose-invert">
                  <p>
                    Once you log in, you will be taken to the main
                    <strong>Dashboard</strong>. The interface is divided into two
                    main sections: the <strong>Sidebar (Left)</strong> for navigation, and the
                    <strong>Main Content Area (Center)</strong> where you will work.
                  </p>
                  <Image
                    src={placeholderImage(800, 450)}
                    alt="Main dashboard with sidebar and content area highlighted."
                    width={800}
                    height={450}
                    className="rounded-lg border"
                    data-ai-hint="app dashboard"
                  />
                  <p className="mt-4">
                    Clicking on your name and avatar at the bottom of the sidebar
                    will open your account menu for accessing settings, notifications, or logging out. A red dot on your avatar means you have new notifications.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-lg">
                  2. The Dashboard
                </AccordionTrigger>
                <AccordionContent className="prose prose-sm max-w-none dark:prose-invert">
                  <p>
                    The Dashboard provides a high-level overview of your referral
                    activity. Key metrics are displayed at the top, and cards
                    below highlight items that need your attention.
                  </p>
                  <Image
                    src={placeholderImage(800, 500)}
                    alt="Dashboard showing key metrics and action items."
                    width={800}
                    height={500}
                    className="rounded-lg border"
                    data-ai-hint="dashboard analytics"
                  />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-lg">
                  3. Managing Referrals
                </AccordionTrigger>
                <AccordionContent className="prose prose-sm max-w-none dark:prose-invert">
                  <p>
                    The <strong>Referrals</strong> page is where you will spend
                    most of your time. You can view, filter, sort, and manage
                    all patient referrals.
                  </p>
                  <ul className="list-disc pl-6">
                    <li>
                      <strong>New Referral:</strong> Click the "New Referral" button to open the creation dialog.
                    </li>
                    <li>
                      <strong>Filtering:</strong> Use the tabs, filter dropdown, and search bar to find specific referrals.
                    </li>
                    <li>
                      <strong>Details:</strong> Click any row in the table to open the Referral Details dialog.
                    </li>
                    <li>
                        <strong>Editing:</strong> From the details dialog, toggle "Edit Mode" to make changes.
                    </li>
                  </ul>
                   <Image
                    src={placeholderImage(800, 400)}
                    alt="Referrals page showing table and filters."
                    width={800}
                    height={400}
                    className="rounded-lg border"
                    data-ai-hint="data table"
                  />
                </AccordionContent>
              </AccordionItem>
               <AccordionItem value="item-4">
                <AccordionTrigger className="text-lg">
                  4. Managing Patients
                </AccordionTrigger>
                <AccordionContent className="prose prose-sm max-w-none dark:prose-invert">
                  <p>
                    The <strong>Patients</strong> page allows you to search for patients and view their demographic information and referral history.
                  </p>
                   <p>
                    Click any patient row to open the Patient Record dialog, which contains their demographic info and a full list of their referrals.
                  </p>
                </AccordionContent>
              </AccordionItem>
               <AccordionItem value="item-5">
                <AccordionTrigger className="text-lg">
                  5. Admin Functions
                </AccordionTrigger>
                <AccordionContent className="prose prose-sm max-w-none dark:prose-invert">
                    <p>Users with <strong>Manager</strong> or <strong>Admin</strong> roles can access administrative functions from the "Admin" section in the sidebar.</p>
                    <h4 className="font-semibold mt-4">User Management</h4>
                    <p>Add, edit, and manage user accounts, including their roles, status, and specific permission overrides.</p>
                    <h4 className="font-semibold mt-4">Location Management (Admins Only)</h4>
                    <p>Manage the hierarchy of facilities and departments. Settings applied to a parent location are automatically inherited by its children unless an override is set.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </main>
    </AppLayout>
  );
}
