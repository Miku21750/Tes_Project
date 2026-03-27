import CaseField from "../components/CaseField"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { SearchCommandBlock } from "../components/sc-select"
import { Checkbox } from "../components/ui/checkbox"
import { Button } from "../components/ui/button"
import { useEffect, useMemo, useState } from "react"
import { Textarea } from "../components/ui/textarea"
import ApiCustomer from "../api"
import { debounce } from "lodash-es"

export const GenerateTicket = () => {
    function classNames(...s) {
        return s.filter(Boolean).join(" ");
    }
    const [step, setStep] = useState(1)
    const nextStep = () => setStep((prev) => prev + 1)
    const prevStep = () => setStep((prev) => prev - 1)
    const [showCompany, setShowCompany] = useState(false)
    const [isNewContact, setIsNewContact] = useState(false)
    const [contacts, setContacts] = useState([])
    const [companys, setCompanys] = useState([])
    const [selectedContact, setSelectedContact] = useState(null)
    const [selectedCompany, setSelectedCompany] = useState(null)
    const [customerQuery, setCustomerQuery] = useState("")
    const [fetchNotFound, setFetchNotFound] = useState(false)
    const [provContact, setProvContact] = useState([])
    const [cityContact, setCityContact] = useState([])
    const [form, setForm] = useState({
        contact : {
            Salutation: "",
            FirstName: "",
            LastName: "",
            Email: "",
            Phone: "",
            Mobile: "",
            AddressLine1: "",
            Country: "Indonesia",
            City: "",
            StateProvince: "",
            ZipPostalCode: "",
        },
         company: {
            Company: "",
            NPWP:"",
        }
    })
    
    const onChangeContact = (section, field) => (value) => 
        setForm(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
    }));

    const searchCustomer = useMemo(() => debounce(async (q) => {
        if (!q || q.length < 2) {
            setCompanys([])
            setContacts([])
            setFetchNotFound(false)
            return
        }
        try {
            const [contact, company] = await Promise.all([
                ApiCustomer.get(`/api/contact-information`, {params: { search: q }}),
                ApiCustomer.get(`/api/site_account`,{params: { search: q }})
            ])
            const fetchContact = contact.data.data
            const fetchCompany = company.data.data

            setContacts(fetchContact)
            setCompanys(fetchCompany)
            setForm({
                contact: fetchContact,
                company: fetchCompany 
            })
            setFetchNotFound(fetchContact.length === 0 && fetchCompany.length === 0)
        } catch (error) {
            console.error(error)
            setFetchNotFound(true)
        }
    },400),[])

    // Setting route need permission from mukti and rafa
    const onGenerateTicket = async () => {
        const payload = {

        }
        try {
            if (isNewContact && selectedContact && selectedCompany) {
                const [postContact, postCompany] = await Promise.all([
                    ApiCustomer.post(`/api/contact-information`),
                    ApiCustomer.post(`/api/site_account`)
                ])
            }
        } catch (error) {
            console.error(error)
        }
    }
    
        console.log("Selected Contact : ", selectedContact)
        console.log("Selected Companny : ", selectedCompany)
        console.log("First Name : ",form?.contact?.FirstName)
        console.log("Company : ",form?.company?.Company)
        console.log("Fetch contact : ",contacts)
        console.log("Fetch Company : ",companys)
        console.log("Province : ",provContact)
        console.log("Province selected : ",form?.contact?.StateProvince)
        console.log("npwp :",form?.company?.NPWP)
    
    // UseEffect fetch province 
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json`)
                const json = await res.json()
                setProvContact(json ?? [])
            } catch (error) {
                console.log(error)
            }
        })();
    },[])

    // UseEffect fetch City
    useEffect(() => {
         const provObj = provContact.find((p) => p.name === form?.contact?.StateProvince)
        //  console.log('Hello City:',provObj)
         if (provObj?.id) {
            (async () => {
                try {
                    const res = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provObj.id}.json`)
                    const json = await res.json()
                    setCityContact(json ?? [])
                } catch (error) {
                    console.log(error)
                }
            })();
        }
    },[form?.contact?.StateProvince, provContact])
    
    // useEffect selected
    useEffect(() => {
        setForm(prev => ({
            ...prev,
            contact: selectedContact?.ContactID ? selectedContact: prev.contact,
            company: selectedCompany?.SiteAccountID ? selectedCompany: prev.company
        }))
    },[selectedCompany,selectedContact, searchCustomer])

    useEffect(() => {
        if (!selectedContact) return
        (async () => {
            try {
                if (selectedContact.SiteAccountID) {
                    setShowCompany(true)
                    const res = await ApiCustomer.get(`/api/site_account/${selectedContact.SiteAccountID}`)
                    const fetchComp = res.data?.data
                    if (fetchComp) setSelectedCompany(fetchComp)
                } else {
                    setSelectedCompany([])
                    setForm(prevCompany => ({
                        ...prevCompany,
                        prevCompany,
                        company: {Company: "" , NPWP: ""}
                    }))
                    setShowCompany(false)
                }
            } catch (error) {
                console.error(error)
            }
        })()
    },[selectedContact])

    return (
        <>
            <Card className={"rounded-none bg-gray-300 "}>
                <CardHeader className={"text-center"}>
                    <CardTitle>Generate Ticket Customer</CardTitle>
                    <CardDescription>Please search your data or create new your data customer to generate ticket</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Generate Ticket If Data User Already Available */}
                    <Card>
                        <CardContent className={"space-y-2"}>
                            <CaseField label={"Pelanggan/Customer (name/email/phone/company)"} indent>
                                <Input placeholder={"Search...."} className={"rounded-sm ring-1 ring-gray-500"}
                                    value={customerQuery}
                                    onChange={(e) => {
                                        const v = e.target.value
                                        setCustomerQuery(v)
                                        searchCustomer(v)
                                    }}
                                />
                            </CaseField>                    
                                <div className="flex gap-2 items-center">
                                <Checkbox
                                    value={isNewContact}
                                    className={"ring-2 bg-gray-100"}
                                    onCheckedChange={(v) => {
                                        setIsNewContact(Boolean(v))
                                    }}
                                />
                                <span className="text-xs text-muted-foreground">Buat Customer Baru/New Customer (jika tidak ditemukan/if not found)</span>
                                </div>
                        </CardContent>
                    </Card>

                    {(contacts.length > 0 || companys.length > 0 ) ? (
                                <div className="flex flex-col gap-2 mt-2">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className={"text-center"}>Pelanggan/Customer</CardTitle>
                                            <hr />
                                        </CardHeader>
                                        <CardContent className={"flex flex-col gap-2 overflow-auto"}>
                                            {contacts.map((c) => (
                                                <Button
                                                    key={c.ContactID}
                                                    variant={"outline"}
                                                    className={classNames("flex flex-col h-20 whitespace-pre-wrap",selectedContact?.ContactID === c.ContactID && "bg-gray-300")}
                                                    onClick = {() => {
                                                        setSelectedContact(c)
                                                    }}
                                                >
                                                    <div className="font-medium">
                                                        {c.FirstName} {c.LastName}
                                                        {c.site_account?.Company && (
                                                            <span className="text-xs text-muted-foreground"> · {c.site_account.Company}</span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">{c.Email || c.Phone || "-"}</div>
                                                </Button>
                                            ))}
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle className={"text-center"}>Perusahaan/Company</CardTitle>
                                            <hr />
                                        </CardHeader>
                                        <CardContent className={"flex flex-col gap-2 overflow-auto"}>
                                            {companys.map((s) => (
                                                <Button
                                                    key={s.SiteAccountID}
                                                    variant={"outline"}
                                                    className={classNames("flex flex-col h-20 whitespace-pre-wrap",selectedCompany?.SiteAccountID === s.SiteAccountID && "bg-gray-300")}
                                                    onClick={() => {
                                                        setSelectedCompany(s)
                                                    }}
                                                >
                                                    <div className="font-medium">{s.Company}</div>
                                                    <div className="text-xs text-muted-foreground">{s.City}, {s.Country}</div>
                                                </Button>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </div>
                            ): fetchNotFound ? (
                                <span className="">❌ Data customer tidak ditemukan</span>
                            ) : null}   

                    <Card className={"mt-2"}>
                        <CardHeader>
                            <CardTitle className={"text-gray-500 text-center text-sm"}>Pelanggan/Perusahaan (Customer/Company)</CardTitle>
                            <CardDescription className={"text-justify text-xs"}>Isi data customer baru. Centang untuk include ke Company. (Fill in the new customer's details. Check the box to include them in the Company.)</CardDescription>
                            <div className="flex gap-2 items-center">
                                <Checkbox
                                    className={"ring-2 bg-gray-100"}
                                    checked={showCompany}
                                    onCheckedChange={(v) => {
                                        setShowCompany(Boolean(v))
                                    }}
                                />
                                <span className="text-xs text-muted-foreground">Termasuk dengan companny/Include with the companny</span>
                            </div>
                        </CardHeader>

                        <CardContent className={"flex flex-col gap-1 p-4"}>
                            {step === 1 && (
                                <>
                                    <CaseField label={"Sapaan/Salutation"} indent star>
                                        <SearchCommandBlock
                                            value={form?.contact?.Salutation}
                                            onChange={onChangeContact("contact","Salutation")}
                                            options={["Mr.","Mrs."]}
                                            placeholder="Mr/Mrs"
                                            className={"ring-1 ring-gray-500"}
                                            />
                                    </CaseField>

                                    {showCompany && (
                                        <CaseField label={"Nama Perusahaan/Name Company"} indent star>
                                            <Input value={form.company?.Company} className={"rounded-sm ring-1 ring-gray-500"}/>
                                        </CaseField>
                                    )}

                                    <CaseField label={"Nama Pelanggan/Name Customer"} indent star>
                                        <div className="flex gap-2 w-full">
                                            <Input value={form?.contact?.FirstName}  placeholder={"First Name"} className={"rounded-sm ring-1 ring-gray-500"}/>
                                            <Input value={form?.contact?.LastName} placeholder={"Last Name"} className={"rounded-sm ring-1 ring-gray-500"}/>
                                        </div>
                                    </CaseField>

                                    <CaseField label={"No Telepon/Phone No."} indent star>
                                        <Input value={form?.contact?.Phone} className={"rounded-sm ring-1 ring-gray-500"}/>
                                    </CaseField>

                                    <CaseField label={"No WA/Mobile Phone No."} indent>
                                        <Input value={form?.contact?.Mobile} className={"rounded-sm ring-1 ring-gray-500"}/>
                                    </CaseField>
                                    <Button onClick={nextStep} variant={"outline"} className={"w-17 mt-2"} >Next</Button>
                                </>
                            )}

                            {step === 2 && (
                                <>
                                    <CaseField label={"Email"} indent star>
                                        <Input value={form?.contact?.Email} className={"rounded-sm ring-1 ring-gray-500"}/>
                                    </CaseField>

                                    <CaseField label={"Alamat/Address"} indent star>
                                        <Input value={form?.contact?.AddressLine1} className={"rounded-sm ring-1 ring-gray-500"}/>
                                    </CaseField>

                                    <CaseField label={"Negara/Country"} indent star>
                                        <Input placeholder="Indonesia / other" value={form?.contact?.Country} onChange={(e) => onChangeContact("contact","Country")(e.target.value)} className={"rounded-sm ring-1 ring-gray-500"}/>
                                    </CaseField>

                                    <CaseField label={"Provinsi/Province"} indent star>
                                    {form?.contact?.Country === "Indonesia" ? (
                                        <SearchCommandBlock
                                            value={form?.contact?.StateProvince}
                                            onChange={onChangeContact("contact","StateProvince")}
                                            options={provContact.map(item => ({
                                                label: item.name,
                                                value: item.name
                                            }))}
                                            className={"ring-1 rounded-sm"}
                                        />

                                    ) : (
                                        <Input  className={"rounded-sm ring-1"} value={form?.contact?.StateProvince} onChange={(e) => onChangeContact("contact","StateProvince")(e.target.value)}/>
                                    )}
                                    </CaseField>

                                    <CaseField label={"Kota/City"} indent star>
                                        {form?.contact?.Country === "Indonesia" ? (
                                            <SearchCommandBlock
                                                value={form?.contact?.City}
                                                onChange={onChangeContact("contact","City")}
                                                options={cityContact.map((c) => ({
                                                    label: c.name,
                                                    value: c.name
                                                }))}
                                            />
                                            
                                        ) : (
                                            <Input className={"ring-1 rounded-sm"} value={form?.contact?.City} onChange={((e) => onChangeContact("contact","City")(e.target.value))} />
                                        )}
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
                                        <Input value={form?.contact?.ZipPostalCode} className={"rounded-sm ring-1 ring-gray-500"}/>
                                    </CaseField>

                                    {showCompany && (
                                        <CaseField label={"NPWP"} indent>
                                            <Input value={form?.company?.NPWP} className={"rounded-sm ring-1 ring-gray-500"}/>
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
        </>
    )
}