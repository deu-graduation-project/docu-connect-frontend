import { TotalViewChart } from "./components/total-view-chart";
import { DownloadsChart } from "./components/downloads-chart";
import { EngagementChart } from "./components/engagement-chart";
import { AudienceOverviewChart } from "./components/audience-overview-chart";
import RecentActivitiesTable from "./components/recent-activity-table";
type Props = {};

export default function Analytics({}: Props) {
  return (
    <div className="container max-w-7xl  h-full px-4  py-10 space-y-12">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold">User Analytics</h1>
        <p className="text-muted-foreground">
          A quick overview of your activity, downloads, and engagement.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 md:grid-cols-3 lg:grid-cols-5 grid-rows-2 gap-2">
        <div className="grid sm:col-span-3 md:col-span-2 lg:col-span-3">
          <TotalViewChart />
        </div>
        <div className="grid sm:col-span-2 md:col-span-1 lg:col-span-2">
          <DownloadsChart />
        </div>
        <div className="grid sm:col-span-2 md:col-span-1 lg:col-span-2">
          <EngagementChart />
        </div>
        <div className="grid sm:col-span-3  md:col-span-2 lg:col-span-3">
          <AudienceOverviewChart />
        </div>
      </div>
      <div className="py-8 flex flex-col w-full">
        <RecentActivitiesTable />
      </div>
    </div>
  );
}
