import * as React from "react"
import {
  BookMarkedIcon,
  BookOpen,
  Bot,
  FileCog,
  Home,
  PieChart,
  Pin,
  ServerIcon,
  Settings2,
  Slice,
  Stamp,
  Table,
} from "lucide-react"
import { Building, Briefcase, Phone, Folder, Box, Tag, ShieldCheck, ShoppingCart, Wrench, User, HardHat, Heart, Calendar, ClipboardCheck, Hammer, Server, Barcode, CheckCircle } from 'lucide-react';
import { NavMain } from "@/components/sidebar/nav-main"
import { NavProjects } from "@/components/sidebar/nav-projects"

import { NavUser } from "@/components/sidebar/nav-user"
import { TeamSwitcher } from "@/components/sidebar/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

import { useAuth } from "@/context/auth-context";
import { Separator } from "../ui/separator"
import { Hpicon, Javagicon } from "../icon";
import { useDraft } from "../DraftContext";




export function AppSidebar({
  ...props
}) {
  const { drafts } = useDraft();
  const { user } = useAuth();
  if (!drafts) {
    return null;
  }
  const data = {
    // user: {
    //   name: "ME",
    //   email: "m@example.com",
    //   avatar: "/avatars/shadcn.jpg",
    // },
    user: user ?? { name: "", email: "", avatar: "" },
    teams: [
      {
        name: "PT Javag",
        logo: Javagicon,
        plan: "Service Center",
      },
      {
        name: "HP Company",
        logo: Hpicon,
        plan: "Main Company",
      },
     
    ],
    navMain: [
      {
        title: "Master",
        url: "#",
        icon: Bot,
        isActive: true,
        items: [
          {
            title: "Company",
            url: "/app/master/Company_table",
            icon: Building
          },
          {
            title: "Assets",
            url: "/app/master/Assets_table",
            icon: Briefcase
          },
          {
            title: "Contact",
            url: "/app/master/Contact_table",
            icon: Phone
          },
          {
            title: "Case",
            url: "/app/master/Case_table",
            icon: Folder
          },
          {
            title: "Product",
            url: "/app/master/Product_table",
            icon: Box
          },
          {
            title: "Product Type",
            url: "/app/master/ProductType_table ",
            icon: Tag
          },
                  
          {
            title: "Warranty Service",
            url: "/app/master/WarrantyService_table",
            icon: ShieldCheck
          },    
          {
            title: "Material Order",
            url: "/app/master/Mo_table",
            icon: ShoppingCart
          },  
          {
            title: "Work Order",
            url: "/app/master/Wo_table",
            icon: Wrench
          },
          {
            title: "Resource Account",
            url: "/app/master/ResourceAccount",
            icon: User
          },
          {
            title: "Subk Technician",
            url: "/app/master/SubkTechnician",
            icon: HardHat
          },
          {
            title: "Symptom Codes",
            url: "/app/master/symptom_codes",
            icon: Heart
          },
          {
            title: "Bookings",
            url: "/app/master/Bookings",
            icon: Calendar
          },
          {
            title: "Booking Details",
            url: "/app/master/BookingDetails",
            icon: ClipboardCheck
          },
                    {
            title: "Booking Status",
            url: "/app/master/BookingStatus",
            icon: ClipboardCheck
          },
          {
            title: "User",
            url: "/app/master/User_table",
            icon: User
          },  
          {
            title: "Parts",
            url: "/app/master/Part_table",
            icon: Hammer
          },  
          {
            title: "Resource",
            url: "/app/master/Resource_table",
            icon: Server
          }, 
          {
            title: "Repair Class Code",
            url: "/app/master/repairClassCode",
            icon: Slice
          }, 
          {
            title: "Service Catalog",
            url: "/app/master/ServiceCatalog",
            icon: Stamp
          },
          {
            title: "OTC Code",
            url: "/app/master/OTC_Code",
            icon: Barcode
          }, 
          {
            title: "Case Resolution",
            url: "/app/master/CrsTable",
            icon: CheckCircle,
          },
          {
            title: "NMU",
            url: "/app/master/NmuTable",
            icon: FileCog
          },
          {
            title: "NMU Item",
            url: "/app/master/NmuItemTable",
            icon: FileCog
          },
          {
            title: "Failure Code",
            url: "/app/master/Failure",
            icon: FileCog
          },
        ],
      },
      {
        title: "Service",
        url: "#",
        icon: ServerIcon,
        items: [
          {
            title: "Case",
            url: drafts.caseId ? `/app/Case/${drafts.caseId}`: "/app/Master/Case_table",
            disabled: !drafts.caseId,
          },
          {
            title: "Work Order",
            url: drafts.woid ? `/app/work/${drafts.woid}` : "/app/Master/Wo_table",
            disabled: !drafts.woid,
          },
          {
            title: "Material Order",
            url: drafts.moid ? `/app/material_order/${drafts.moid}` : "/app/Master/Mo_table",
            disabled: !drafts.moid,
          },
          {
            title: "MO Line Item",
            url: drafts.moliId ? `/app/material_order/material-order-line-items/${drafts.moliId} ` : "/app/Master/Mo_table",
          },
        
        ],
      },
      {
        title: "Documentation",
        url: "#",
        icon: BookOpen,
        hidden: true,
        items: [
          {
            title: "Introduction",
            url: "#",
          },
          {
            title: "Get Started",
            url: "#",
          },
          {
            title: "Tutorials",
            url: "#",
          },
          {
            title: "Changelog",
            url: "#",
          },
        ],
      },
      {
        title: "Settings",
        url: "#",
        hidden: true,
        icon: Settings2,
        items: [
          {
            title: "General",
            url: "#",
          },
          {
            title: "Team",
            url: "#",
          },
          {
            title: "Billing",
            url: "#",
          },
          {
            title: "Limits",
            url: "#",
          },
        ],
      },  
    ],
    navMasterFD: [
      {
        title: "MasterFD",
        url: "#",
        icon: Bot,
        isActive: true,
        items: [
          {
            title: "Company",
            url: "/app/master/Company_table",
            icon: Building
          },
          {
            title: "Assets",
            url: "/app/master/Assets_table",
            icon: Briefcase
          },
          {
            title: "Contact",
            url: "/app/master/Contact_table",
            icon: Phone
          },
        ],
      },
    ],
    projects: [
      {
        name: "Home",
        title: "Home",
        url: "/app",
        icon: Home,
      },
      {
        name: "Your Cases",
        title: "Your Cases",
        url: "/app/flowcase",
        icon: PieChart,
      },
      {
        name: "Erf Case",
        title: "Erf Case",
        url: "/app/ErfCase",
        icon: BookMarkedIcon,
        only: "fd",
      },
      {
        name: "My Work",
        title: "My Work",
        url: "/app/searchcaseproto2",
        icon: Table,
      },
      {
        name: "View Case",
        title: "View Case",
        url: "/app/viewcase",
        icon: Pin
      },
    ],
    apo: [
      {
        name: "Home",
        title: "Home",
        url: "/app",
        icon: Home,
      },
      {
        name: "Your Cases",
        title: "Your Cases",
        url: "/app/flowcase",
        icon: PieChart,
      },
      {
        name: "View Case",
        title: "View Case",
        url: "/app/viewcase",
        icon: Pin
      },
    ],
    lg: [
      {
        name: "Home",
        title: "Home",
        url: "/app",
        icon: Home,
      },
      {
        name: "View Case",
        title: "View Case",
        url: "/app/viewcase",
        icon: Pin
      },
    ],
    default :[
       {
        name: "Home",
        title: "Home",
        url: "/app",
        icon: Home,
      },
      {
        name: "Your Cases",
        title: "Your Cases",
        url: "/app/flowcase",
        icon: PieChart,
      },
    ]
  }

  let navrole ;
  
  let DropNav;
  if (data.user.role === 'admin') {
    navrole = data.projects;
    DropNav = (
      <NavMain
        className="bg-cyan-700"
        items={data.navMain}
        activeClassName="bg-cyan-800 text-white"
      />
    );
  } else if (data.user.role === 'fd' || data.user.role === 'user') {
    navrole = data.projects;
    DropNav = (
      <NavMain
        className="bg-cyan-700"
        items={data.navMasterFD}
        activeClassName="bg-cyan-800 text-white"
      />
    );
  } else if (data.user.role === 'apo' || data.user.role === 'ce'  ||  data.user.role === 'celead' || data.user?.role === 'apv' || data.user?.role === 'cm'){
    navrole = data.apo;
  } else if (data.user.role === 'lg' || data.user.role === 'ps'){
    navrole = data.lg;
    DropNav = '';
  } else {
    navrole = data.default;
  }

  return (  
    <Sidebar collapsible="icon" {...props} className="border-0 bg-none z-40 h-auto ">
      <SidebarHeader className={'bg-gradient-to-l from-hp-50 via-hp-200 to-hp-300'}>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent className={'bg-gradient-to-b from-hp-300 via-hp-400 to-hp-500 text-white'}>
        <NavProjects projects={navrole} user={data.user} />
        
        {/* <Separator className={'border-2'}></Separator> */}
        {DropNav}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
