import React from 'react'
import  { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './components/ui/card'
import { Input } from './components/ui/input'
import { InfoSide } from './components/info-sidebar'
import { 
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from './components/ui/sidebar' 

import { Button } from "@/components/ui/button"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Eye,
  Frame,
  GalleryVerticalEnd,
  Home,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Plus,
} from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
 
const assets = [
  {
    AssetID: 1,
    SerialNumber: "SN123456",
    ProductName: "Laptop X100",
    ProductNumber: "PX100-2024",
    ProductLine: "Laptops",
    SiteAccountID: 101,
  },
  {
    AssetID: 2,
    SerialNumber: "SN654321",
    ProductName: "Smartphone Z5",
    ProductNumber: "SZ5-2024",
    ProductLine: "Smartphones",
    SiteAccountID: 102,
  },
  {
    AssetID: 3,
    SerialNumber: "SN789012",
    ProductName: "Tablet A10",
    ProductNumber: "TA10-2024",
    ProductLine: "Tablets",
    SiteAccountID: 103,
  },
  {
    AssetID: 4,
    SerialNumber: "SN345678",
    ProductName: "Monitor UltraWide",
    ProductNumber: "MUW-2024",
    ProductLine: "Monitors",
    SiteAccountID: 104,
  },
  {
    AssetID: 5,
    SerialNumber: "SN567890",
    ProductName: "Gaming Mouse GX500",
    ProductNumber: "GMGX500-2024",
    ProductLine: "Accessories",
    SiteAccountID: 105,
  },
  {
    AssetID: 6,
    SerialNumber: "SN908172",
    ProductName: "Mechanical Keyboard MK700",
    ProductNumber: "MKMK700-2024",
    ProductLine: "Accessories",
    SiteAccountID: 106,
  },
  {
    AssetID: 7,
    SerialNumber: "SN382910",
    ProductName: "External Hard Drive 1TB",
    ProductNumber: "EHD1TB-2024",
    ProductLine: "Storage",
    SiteAccountID: 107,
  },
];

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

const data = {
  navMain: [
    {
      title: "Account info",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          value: "#",
        },
        {
          title: "Starred",
          value: "#",
        },
        {
          title: "Settings",
          value: "#",
        },
      ],
    },
    {
      title: "Contact info",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          value: "#",
        },
        {
          title: "Explorer",
          value: "#",
        },
        {
          title: "Quantum",
          value: "#",
        },
      ],
    },
    {
      title: "Asset info",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          value: "#",
        },
        {
          title: "Get Started",
          value: "#",
        },
        {
          title: "Tutorials",
          value: "#",
        },
        {
          title: "Changelog",
          value: "#",
        },
      ],
    },
    {
      title: "Entitlement info",
      icon: Settings2,
      items: [
        {
          title: "General",
          value: "#",
        },
        {
          title: "Team",
          value: "#",
        },
        {
          title: "Billing",
          value: "#",
        },
        {
          title: "Limits",
          value: "#",
        },
      ],
    },
  ],
}
const Search_case = () => {
  return (
    
    <div className="flex flex-1  gap-4 p-4 pt-0">
      <div className="flex  min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
        <Tabs defaultValue="search" className="w-full">
          <TabsList className=" w-full flex justify-between h-[3em]">
            <div className="w-2xs">
              <TabsTrigger value="search">Search</TabsTrigger>
              <TabsTrigger value="ci">Costumer Information</TabsTrigger>
            </div>
            <Button><span><Plus></Plus></span>Create Case</Button>

            {/* Modal/Dialog */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="bg-black text-white" variant="outline">Show Dialog</Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-gray-100 max-w-3xl w-full max-w-[90vw]">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription className="max-h-[70vh] overflow-y-auto">
                    <Table>
                      <TableCaption>A list of your assets.</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[150px]">Serial Number</TableHead>
                          <TableHead>Product Name</TableHead>
                          <TableHead>Product Number</TableHead>
                          <TableHead>Product Line</TableHead>
                          <TableHead className="text-right">Site Account ID</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {assets.map((asset) => (
                          <TableRow key={asset.AssetID}>
                            <TableCell className="font-medium">{asset.SerialNumber}</TableCell>
                            <TableCell>{asset.ProductName}</TableCell>
                            <TableCell>{asset.ProductNumber}</TableCell>
                            <TableCell>{asset.ProductLine}</TableCell>
                            <TableCell className="text-right">{asset.SiteAccountID}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

          </TabsList>
          <TabsContent value="search">
            <Card>
              <CardContent className="space-y-2 grid gap-1 grid-cols-3">
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email"  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="serialnumber">Serial Number</Label>
                  <Input id="serialnumber" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company"  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="zippostal">Zip/Postal</Label>
                  <Input id="zippostal" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone"  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="assettag">Asset Tag</Label>
                  <Input id="assettag" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="contrackid">Contrack Id</Label>
                  <Input id="contrackid" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="transactiontype">Transaction Type</Label>
                  <Input id="transactiontype"  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="transactiontid">Transaction Id</Label>
                  <Input id="transactiontid" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="opsi">Opsi</Label>
                  <Input id="opsi" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="lisensekey">Lisense key</Label>
                  <Input id="lisensekey"  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="pin">Pin</Label>
                  <Input id="pin" />
                </div>
                
              </CardContent>
              <CardFooter>
                <Button>Save changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="ci">
            <Card>
              {/* <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password here. After saving, you'll be logged out.
                </CardDescription>
              </CardHeader> */}
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="current">Current password</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new">New password</Label>
                  <Input id="new" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <div className="flex  flex-col min-h-[100vh]  rounded-xl bg-muted/50 md:min-h-min">
        <Sidebar side='right' className="relative" collapsible='icon'>
          <SidebarContent>
            <InfoSide items={data.navMain} />
          </SidebarContent>
        </Sidebar>
      </div>
    </div>
  )
}

export default Search_case
