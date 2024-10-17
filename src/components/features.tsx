import React from "react";

type Props = {};

export default function FeaturesSection({}: Props) {
  return (
    <div>
      <section
        id="features"
        className="container max-w-6xl  mx-auto space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24"
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h1 className="  text-4xl font-semibold text-center ">Features</h1>

          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Unlock Powerful Features for Users and Agencies
          </p>
        </div>
        <div className="mx-auto grid justify-between   gap-4 sm:grid-cols-2 max-w-[95vw]  md:grid-cols-3 lg:grid-cols-4">
          <div className="relative overflow-hidden  rounded-lg border bg-background p-2">
            <div className="flex h-[300px] flex-col justify-between rounded-md p-6">
              <p className="text-sm text-muted-foreground"> {"(for users)"}</p>
              <div className="space-y-2">
                <h3 className="font-bold">
                  Seamless Ordering and PDF Customization
                </h3>
                <p className="text-sm text-muted-foreground">
                  Upload and edit your documents before submitting them to local
                  agencies for printing. Reduce your printing costs and ensure
                  your files are exactly how you want them.
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[300px] flex-col justify-between rounded-md p-6">
              <p className="text-sm text-muted-foreground"> {"(for users)"}</p>

              <div className="space-y-2">
                <h3 className="font-bold">Build Your Personal Library</h3>
                <p className="text-sm">
                  Create a collection of notes, documents, or study materials.
                  Choose to keep them private or share them with other users in
                  our growing knowledge community.
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[300px] flex-col justify-between rounded-md p-6">
              <p className="text-sm text-muted-foreground"> {"(for users)"}</p>

              <div className="space-y-2">
                <h3 className="font-bold">Search and Discover</h3>
                <p className="text-sm text-muted-foreground">
                  Looking for a specific topic? Use our powerful search to find
                  public notes and documents uploaded by other users. Filter by
                  subject, agency, or popularity.
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[300px] flex-col justify-between rounded-md p-6">
              <p className="text-sm text-muted-foreground"> {"(for users)"}</p>

              <div className="space-y-2">
                <h3 className="font-bold">Track Orders and Review Agencies</h3>
                <p className="text-sm text-muted-foreground">
                  Stay updated on the status of your print jobs and leave
                  feedback for agencies after your order is completed.
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[300px] flex-col justify-between rounded-md p-6">
              <p className="text-sm text-muted-foreground">
                {" "}
                {"(for agencies)"}
              </p>

              <div className="space-y-2">
                <h3 className="font-bold">Manage Your Services</h3>
                <p className="text-sm text-muted-foreground">
                  Create a profile for your copy center, offer a range of
                  products, and set your own pricing. Easily manage orders from
                  users and track business performance through detailed
                  analytics.
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[300px] flex-col justify-between rounded-md p-6">
              <p className="text-sm text-muted-foreground">
                {" "}
                {"(for agencies)"}
              </p>
              <div className="space-y-2">
                <h3 className="font-bold">Direct Communication with Users</h3>
                <p className="text-sm text-muted-foreground">
                  Chat with customers about their orders, confirm details, and
                  resolve any issues directly within the app.{" "}
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[300px] flex-col justify-between rounded-md p-6">
              <p className="text-sm text-muted-foreground">
                {" "}
                {"(for agencies)"}
              </p>
              <div className="space-y-2">
                <h3 className="font-bold">Boost Your Visibility</h3>
                <p className="text-sm text-muted-foreground">
                  Gain access to a growing user base looking for reliable copy
                  centers. Your agency will be featured in search results when
                  users look for services near them.
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[300px] flex-col justify-between rounded-md p-6">
              <p className="text-sm text-muted-foreground">
                {" "}
                {"(for agencies)"}
              </p>
              <div className="space-y-2">
                <h3 className="font-bold">Order Management and Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Accept or reject orders in real time, and use our dashboard to
                  track revenue, completed orders, and customer reviews.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
