import CaseField from "../components/CaseField"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { SearchCommandBlock } from "../components/sc-select"
import { Checkbox } from "../components/ui/checkbox"
import { Button } from "../components/ui/button"
import { useEffect, useState } from "react"
import { Textarea } from "../components/ui/textarea"
import ApiCustomer from "../api"

export const GenerateTicket = () => {
    const [showCompany, setShowCompany] = useState(false)
    const [form, setForm] = useState({
        Salutation: "",
        FirstName: "",
        LastName: "",
        Email: "",
        Phone: "",
        Mobile: "",
        AddressLine1: "",
        AddressLine2: "",
        City: "",
        StateProvince: "",
        Country: "",
        ZipPostalCode: "",
        Company: "",
        NPWP:"",
    })
    const [step, setStep] = useState(1)
    const nextStep = () => setStep((prev) => prev + 1)
    const prevStep = () => setStep((prev) => prev - 1)

    const searchCustomer = async () => {
        try {
            const [contacts, companies] = await Promise.all([
                ApiCustomer.get(`/api/contact-information`),
                ApiCustomer.get(`/api/site_account`)
            ])
            const allFecth = [
                contacts.data.data,
                companies.data.data
            ]
            setForm(allFecth)
            console.log("Contact Data : ",contacts.data.data)
            console.log("Company data : ",companies.data.data)
        } catch (error) {
            console.error(error)
        }   
    }

    useEffect(() => {
        setShowCompany(true)
        searchCustomer()
    }, [])

    return (
        <>
            <Card className={"rounded-none bg-gray-300"}>
                <CardHeader className={"text-center"}>
                    <CardTitle>Generate Ticket Customer</CardTitle>
                    <CardDescription>Please search your data or create new your data customer to generate ticket</CardDescription>
                </CardHeader>
                <CardContent>
                        {/* Generate Ticket If Data User Already Available */}
                        <Card>
                            <CardContent className={"space-y-2"}>
                                <CaseField label={"Pelanggan/Customer (name/email/phone/company)"} indent>
                                    <Input placeholder={"Search...."} className={"rounded-sm ring-1 ring-gray-500"}/>
                                </CaseField>
                                 <div className="flex gap-2 items-center">
                                    <Checkbox
                                        className={"ring-2 bg-gray-100"}
                                    />
                                        <span>Buat Customer Baru/New Customer (jika tidak ditemukan/if not found)</span>
                                 </div>
                                <Card className={"mt-4"}>
                                    <CardHeader>
                                        <CardTitle className={"text-gray-500"}>Pelanggan/Perusahaan (Customer/Company)</CardTitle>
                                        <CardDescription>Isi data customer baru. Centang untuk include ke Company. (Fill in the new customer's details. Check the box to include them in the Company.)</CardDescription>
                                        <div className="flex gap-2 items-center">
                                            <Checkbox
                                                className={"ring-2 bg-gray-100"}
                                                checked={showCompany}
                                                onCheckedChange={(v) => {
                                                    const checked = Boolean(v)
                                                    setShowCompany(checked)
                                                }}
                                            />
                                            <span>Termasuk dengan companny/Include with the companny</span>
                                    </div>
                                    </CardHeader>

                                    <CardContent className={"flex flex-col gap-1 p-4"}>
                                        {step === 1 && (
                                            <>
                                                <CaseField label={"Sapaan/Salutation"} indent star>
                                                    <SearchCommandBlock
                                                        options={["Mr","Mrs"]}
                                                        placeholder="Mr/Mrs"
                                                        className={"ring-1 ring-gray-500"}
                                                    />
                                                </CaseField>

                                                {showCompany && (
                                                    <CaseField label={"Nama Perusahaan/Name Company"} indent star>
                                                        <Input className={"rounded-sm ring-1 ring-gray-500"}/>
                                                    </CaseField>
                                                )}

                                                <CaseField label={"Nama Pelanggan/Name Customer"} indent star>
                                                    <div className="flex gap-2 w-full">
                                                        <Input placeholder={"First Name"} className={"rounded-sm ring-1 ring-gray-500"}/>
                                                        <Input placeholder={"Last Name"} className={"rounded-sm ring-1 ring-gray-500"}/>
                                                    </div>
                                                </CaseField>

                                                <CaseField label={"No Telepon/Phone No."} indent star>
                                                    <Input className={"rounded-sm ring-1 ring-gray-500"}/>
                                                </CaseField>

                                                <CaseField label={"No WA/Mobile Phone No."} indent>
                                                    <Input className={"rounded-sm ring-1 ring-gray-500"}/>
                                                </CaseField>
                                                <Button onClick={nextStep} variant={"outline"} className={"w-17 mt-2"} >Next</Button>
                                            </>
                                        )}

                                        {step === 2 && (
                                            <>
                                                <CaseField label={"Email"} indent star>
                                                    <Input className={"rounded-sm ring-1 ring-gray-500"}/>
                                                </CaseField>

                                                <CaseField label={"Alamat/Address"} indent star>
                                                    <Input className={"rounded-sm ring-1 ring-gray-500"}/>
                                                </CaseField>

                                                <CaseField label={"Negara/Country"} indent star>
                                                    <Input className={"rounded-sm ring-1 ring-gray-500"}/>
                                                </CaseField>

                                                <CaseField label={"Provinsi/Province"} indent star>
                                                    <Input className={"rounded-sm ring-1 ring-gray-500"}/>
                                                </CaseField>

                                                <CaseField label={"Kota/City"} indent star>
                                                    <Input className={"rounded-sm ring-1 ring-gray-500"}/>
                                                </CaseField>
                                                <div className="flex gap-2 mt-2">
                                                    <Button onClick={prevStep} variant={"outline"} className={""}>Back</Button>
                                                    <Button onClick={nextStep} variant={"outline"} className={""}>Next </Button>
                                                </div>
                                            </>
                                        )}

                                        {step === 3 && (
                                            <>
                                                <CaseField label={"Zip Code"} indent>
                                                    <Input className={"rounded-sm ring-1 ring-gray-500"}/>
                                                </CaseField>

                                                {showCompany && (
                                                    <CaseField label={"NPWP"} indent>
                                                        <Input className={"rounded-sm ring-1 ring-gray-500"}/>
                                                    </CaseField>
                                                )}

                                                <CaseField label={"Jenis Produk/Product Description"} indent star>
                                                    <div className="flex gap-2 w-full ">
                                                        <Input placeholder={"Serial Number"} className={"rounded-sm ring-1 ring-gray-500"}/>
                                                        <Input placeholder={"Product Number"} className={"rounded-sm ring-1 ring-gray-500"}/>
                                                    </div>
                                                </CaseField>

                                                <CaseField label={"Jenis Kerusakan/Problem Description"} indent star>
                                                    <Textarea className={"ring-1 ring-gray-500"}></Textarea>
                                                </CaseField>
                                                <div className="flex gap-2 mt-2">
                                                    <Button onClick={prevStep} variant={"outline"}>Back</Button>
                                                    <Button className={"bg-blue-500 text-white hover:bg-green-500"}>Submit</Button>
                                                </div>
                                            </>
                                        )}                                       
                                    </CardContent>
                                </Card>
                            </CardContent>
                        </Card>
                </CardContent>
            </Card>
        </>
    )
}