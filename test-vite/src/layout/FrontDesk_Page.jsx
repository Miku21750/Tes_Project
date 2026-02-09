import ApiCustomer from '@/api';
import { NotificationCard } from '@/components/NotificationCard';
import { ChartRadialText, ChartTooltipAdvanced } from '@/components/sc-chart';
import ToastTester from '@/components/ToastComponent';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardFooter, CardContent, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/auth-context';
import { useSocket } from '@/hooks/useSocket';
import { cn } from '@/lib/utils';
import { set } from 'lodash';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import { STATUS_ENUM_TO_LABEL } from '@/hooks/useCaseStatus';
import { buildBusinessDayCaseTypeSeries } from '@/components/chart-data/utils-config';

export default function FrontDesk_Page() {
  const { user } = useAuth();
  const [userData, setUserData] = useState([]);
  const [caseData, setCaseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [casevaluedata, setCasevaluedata] = useState([])
  const [inactivecasevaluedata, setInactivecasevaluedata] = useState([])
  const [closecasevaluedata, setClosecasevaluedata] = useState([])
  const [preview, setPreview] = useState({
      ProfilePhoto: null,
      Signature: null,
  });
  const [weeklyChartData, setWeeklyChartData] = useState([]);
  const [notfilog, setNotfilog] = useState([])
  const radialchartdata = [
    { name: "Open", value: casevaluedata || 0, fill: "#3B82F6" },
    { name: "InActive", value: inactivecasevaluedata || 0, fill: "#FACC15" },
    { name: "Closed", value: closecasevaluedata || 0, fill: "#10B981" },
  ];


  useSocket("case:created", (newCase) => {
    setCaseData((prev) => [newCase, ...prev]); // prepend
  });

  useSocket("case:updated", (updated) => {
    setCaseData((prev) =>
      prev.map((c) => (c.CaseID === updated.CaseID ? updated : c))
    );
  });



  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await ApiCustomer.get('/api/case-information');
      const fecthUserData = await ApiCustomer.get(`/api/user/${user.id}`);
      const resFetchUserData = fecthUserData.data.data;
      const series = buildBusinessDayCaseTypeSeries(response.data.data,user, { days: 6 });
      setWeeklyChartData(series);

      setUserData({
        ...userData,
        Username: resFetchUserData.Username,
        Name: resFetchUserData.Name,
        Email: resFetchUserData.Email,
        Phone: resFetchUserData.Phone || "",
        ProfilePhoto: resFetchUserData.ProfilePhoto,
        Signature: resFetchUserData.Signature,
      })
      setPreview({
        ProfilePhoto: fecthUserData.data.data.ProfilePhoto ? `${import.meta.env.VITE_API_BASE_URL}${fecthUserData.data.data.ProfilePhoto}` : null,
        Signature: fecthUserData.data.data.Signature ? `${import.meta.env.VITE_API_BASE_URL}${fecthUserData.data.data.Signature}` : null,
      });
      const valuefiltercases = response.data.data.filter(c => c?.caseinformation?.CreatedBy == user.id);
      const valueFilterOpenCase = response.data.data.filter(c => c?.CaseStatus == 'Open' && c?.caseinformation?.CreatedBy == user.id)
      const valueFilterInActiveCase = response.data.data.filter(c => c?.CaseStatus == 'InActive' && c?.caseinformation?.CreatedBy == user.id)
      const valueFilterCloseCase = response.data.data.filter(c => c?.CaseStatus == 'Close' && c?.caseinformation?.CreatedBy == user.id)
      const filtercases = response.data.data.filter(c => c?.CaseStatus !== 'Close' && c?.caseinformation?.Owner == user.id);
      const sortedCases = filtercases.sort((a, b) => {
        const dateAraw = a.UpdateOn;
        const dateBraw = b.UpdateOn;

        const dateA = dateAraw ? (dateAraw instanceof Date ? dateAraw : new Date(dateAraw)) : new Date(0);
        const dateB = dateBraw ? (dateBraw instanceof Date ? dateBraw : new Date(dateBraw)) : new Date(0);

        return dateB - dateA; // newest first
      });
      const recentCases = sortedCases.slice(0, 3);
      
      setCaseData(recentCases);
      setCasevaluedata(valueFilterOpenCase?.length);
      setInactivecasevaluedata(valueFilterInActiveCase?.length)
      setClosecasevaluedata(valueFilterCloseCase?.length);
      return response.data.data;
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Gagal memuat data. Silakan coba lagi.',
      });
      console.error('Error fetching case data:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);
 
  const navigate = useNavigate();
function getMetricKeys(data, excludedKeys = ["date"]) {
  if (!Array.isArray(data) || data.length === 0) return [];

  return Object.keys(data[0]).filter(
    key => !excludedKeys.includes(key)
  );
}

const checkdata =  getMetricKeys(weeklyChartData);
  return (
    <div className="min-h-[calc(100vh-64px)]  h-full w-full grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gradient-to-t  dark:from-slate-800 dark:via-slate-600 dark:to-slate-800 dark:to-70% dark:via-6% dark:from-1%" id="dashboard">
      {/* Left Column - Profile */}
      <div className="col-span-1">
        <Card className="rounded-xl shadow-lg h-full flex flex-col dark:border-slate-600 dark:border-r-6 dark:bg-gradient-to-bl dark:from-slate-800 dark:via-slate-700 dark:to-slate-700" id="profile">
          <CardHeader className="bg-gradient-to-r from-cyan-500 to-cyan-400 text-white text-center relative dark:bg-gradient-to-r dark:from-slate-800 dark:via-slate-500 dark:to-slate-400 dark:to-130% via-70% from-2%">
            <div className="flex flex-col items-center">
              {preview.ProfilePhoto ? (
                <img
                  src={preview.ProfilePhoto}
                  alt="Profile Preview"
                  className="w-20 h-20 rounded-full border-4 border-white shadow-md -mb-10"
                />
              ) : (
                <div className="w-20 h-20 flex items-center justify-center rounded-full border-4 border-white shadow-md mb-10 bg-cyan-100">
                  <span className="text-3xl font-bold text-cyan-600">?</span>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="pt-12 text-center flex-1 space-y-2">
            <CardTitle className="text-lg">{user?.name || "User"}</CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{userData.Phone}</p>
          </CardContent>

          <CardFooter className="flex flex-col gap-2 items-center">
            <Badge
              variant="outline"
            >
              {user.role}
            </Badge>
            <p className="text-xs text-gray-500 dark:text-gray-300">
              Latest Login: {new Date().toLocaleString()}
            </p>
          </CardFooter>
        </Card>
      </div>

      {/* Center Column - Chart */}
      <div className="col-span-1 md:col-span-2">
        {/* <Card className="rounded-xl shadow-lg p-4 h-full flex flex-col dark:border-slate-600 dark:border-r-6  dark:bg-gradient-to-bl dark:from-slate-800 dark:via-slate-700 dark:to-slate-700 dark:to-10% via-80% from-20%" id="cases-overview"> */}
        {/*   <CardHeader> */}
        {/*     <CardTitle>Cases Overview</CardTitle> */}
        {/*     <CardDescription>Today’s activity</CardDescription> */}
        {/*   </CardHeader> */}
        {/*   <CardContent className="flex-1 flex items-center justify-center"> */}
        {/*     <ChartRadialText radialchartdata={radialchartdata} /> */}
        {/*   </CardContent> */}
        {/* </Card> */}
        <ChartTooltipAdvanced datachart={weeklyChartData}/>
      </div>

      {/* Right Column - Notifications */}
      <div className="col-span-1">
        <Card className="rounded-xl shadow-lg py-4 h-full flex flex-col dark:border-slate-600 dark:border-r-6 dark:bg-gradient-to-bl dark:from-slate-800 dark:via-slate-700 dark:to-slate-700 dark:to-10% via-90% from-30%" id="notifications">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto space-y-3 max-h-[40vh]">
            <NotificationCard />
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row - Recent Cases */}
      <div className="col-span-1 md:col-span-4">
        <Card className="rounded-xl shadow-lg p-4 h-full dark:border-slate-600 dark:border-r-6 dark:bg-gradient-to-tr dark:from-slate-800 dark:via-slate-700 dark:to-slate-700 dark:to-20% via-80% from-30%" id='recent-case'>
          <CardHeader>
            <CardTitle>Recent Cases</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-h-[45vh]">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg" />
              ))
              : caseData.map((c) => (
                <Card
                  key={c.CaseID}
                  className="p-3 border-l-4 hover:scale-[0.99] rounded-lg shadow-sm hover:shadow-lg transition-all border-teal-400  dark:border-l-4 dark:border-slate-600 cursor-pointer dark:bg-gradient-to-tr dark:from-slate-800 dark:via-slate-700 dark:to-slate-700 dark:to-20% via-80% from-50%"
                  onClick={() => navigate(`/app/case/${c.CaseID}`)}
                >
                  <div className="flex flex-wrap items-center gap-2  ">
                    <Badge
                      className={`px-2 py-1 rounded-md text-xs font-medium
                      ${c.caseinformation.CasePriority === "High"
                          ? "bg-orange-100 text-orange-700"
                          : c.caseinformation.CasePriority === "Critical"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-200 text-gray-700"
                        }`}
                    >
                      {c?.caseinformation.CasePriority || "Low"}
                    </Badge>
                    <Badge className="px-2 py-1 rounded bg-blue-100 text-blue-700">
                      {STATUS_ENUM_TO_LABEL[c.CaseStatus]}
                    </Badge>
                    <p className='ml-auto text-xs text-gray-500 dark:text-slate-400'>{c.CreatedOn}</p>
                  </div>
                  <p className={cn("text-xs truncate ", !c.CaseSubject && 'text-red-500')}>{c.CaseSubject || "No Subject"}</p>
                  <div className=" text-gray-500 mt-1 flex justify-between">
                    <p className='text-md dark:text-slate-400'>{c.CaseID}</p>
                    <p className='text-md  font-semibold dark:text-slate-400'>{c.UpdateOn ? new Date(c.UpdateOn).toLocaleString("id-ID") : "No Update"}</p>
                  </div>
                </Card>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>


  );
}


