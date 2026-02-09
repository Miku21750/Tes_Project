import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
  Link,
} from "@react-pdf/renderer";
import React from "react";
import { formatAccountingRupiah } from "../lib/utils";
import { formatDate } from "../lib/utils";
import { FormatRupiah } from "./QuatationInvoice";

Font.register({
  family: "Helvetice",
  fonts: [{ src: "https://fonts.gstatic.com/s/helvetica/Helvetica.ttf" }],
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
  },
  sectionHeader: {
    textAlign:"center",
    fontSize: 11,
    fontWeight: 'bold',
  },
  Header: {
    textDecoration: "underline",
    textAlign:"center",
    fontSize: 15,
    fontWeight: 'bold',
  },
  textSmall: {
    fontSize: 8,
  },
  textCenter: {
    textAlign: 'center',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(8, 1fr)',
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
  bold: {
    fontWeight: 'bold',
  },
  qrCode: {
    width: 45,
    height: 45,
  },
  logo: {
    width: 65,
    height: 65,
  },
  
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 2,
  },
  rightSection: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection2: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 2,
  },
  label: {
    width: '30%', 
    fontSize: 8,
  },
  label2: {
    width: '20%', 
    fontSize: 8,
  },
  value: {
    width: '68%',
    fontSize: 8,
  },
  value1: {
    width: '68%',
    fontSize: 8,
    textAlign: 'justify',
    textIndent: -5,
  },
  colon: {
    width: '2%',
    fontSize: 8,
  },
  value2: {
    width: '80%',
    fontSize: 8,
  },
table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    flex: 1,                     // default equal width (good for 3-col table)
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 2,
    fontSize: 7,
  },
  tableHeaderCell: {
    flex: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#000',
    padding: 2,
    fontSize: 7,
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: '#f3f4f6', 

  },
  alignRight: { textAlign: 'right' },
  

  /* ===== extra styles ONLY for the 7-column “parts” table ===== */
  partsColNo: { flex: 0.7 },
  partsColVendor: { flex: 1.5 },
  partsColHp: { flex: 1.6 },
  partsColPartName: { flex: 3 },
  partsColQty: { flex: 0.8 },
  partsColUnitPrice: { flex: 1.2 },
  partsColTotalPrice: { flex: 1.2 },

  // flex sums (0.7+1.5+1.6+3+0.8 = 7.6, all cols = 10)
  partsColSpan5: { flex: 8 },  // No + Vendor + HP + Part Name + QTY
  partsColSpan6: { flex: 9.3 },  // above + Unit Price

  alignCenter: {
    textAlign: 'center',
  },
  
  sectionContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginVertical: 4,
    paddingTop: 12, // extra space so the title doesn't overlap content
    position: 'relative',
  },

  sectionTitle: {
    position: 'absolute',
    top: -6, // moves the heading above the border
    left: 10,
    fontSize: 10,
    fontWeight: 'bold',
    backgroundColor: 'white', // covers the border behind text
    paddingHorizontal: 4,
  },

  sectionContent: {
    paddingHorizontal: 10,
    paddingBottom: 8,
  },
});

const Section = ({ title, children }) => (
  <View  style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionContent}>{children}</View>
  </View>
);

const List = ({ items }) => (
  <View>
    {items.map((item, index) => (
      <Text key={index} style={styles.value1}>
        • {item}
      </Text>
    ))}
  </View>
)

let counter = 0;

export const Invoice = ({
  caseDetails,
  customerSignature,
  materialItems = {},
  initialData = {},
  qrcode
}) => (
  <Document>
    <Page  size="A4" style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          gap: 20,
          alignItems: "center",
          marginBottom: 4,
          padding: 3,
          borderBottom: 1,
        }}
      >
        <Image src="/Javag.jpeg" style={[styles.logo, { padding: 2 }]} />
      
        <View>
          <Text style={styles.sectionHeader}>PT.JAVA ABADI GEMILANG</Text>
          <Text style={[styles.textSmall, {flexWrap: 'wrap', maxWidth: 200}]}>
            {caseDetails?.createdByUser?.resource?.AddressLine}
          </Text>
          <Text style={styles.textSmall}>
            Telp : {caseDetails?.createdByUser?.resource?.Phone}
          </Text>
        </View>
              
      </View>

      <Text style={[styles.Header]}>INVOICE</Text>

      <Section title="Case Info">
        <View style={{ display: "flex", flexDirection: "row" }}>
          <View style={styles.leftSection}>
            <Text style={[styles.label, { fontWeight: "bold", fontSize: 12 }]}>
              No. Invoice
            </Text>
            <Text style={[styles.colon, { fontWeight: "bold", fontSize: 10 }]}>
              :
            </Text>
            <Text style={[styles.value, { fontWeight: "bold", fontSize: 10 }]}>
              {caseDetails.workorder[0]?.materialorder[0]?.materialorderlineitems[0]?.quotation_lineitem[0]?.quotation?.invoicetable[0]?.InvoiceNo}
            </Text>

            <Text style={styles.label}>Case Type</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>{caseDetails?.CaseType ?? "N/A"}</Text>

            <Text style={styles.label}>Warranty Status</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
              {caseDetails?.asset_information?.WarrantyOTCCode?.Description ??
                "N/A"}
            </Text>

            <Text style={styles.label}>Received Date</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
              {formatDate(caseDetails?.CreatedOn) || "N/A"}
            </Text>

            <Text style={styles.label}>Quotation Date</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
              {formatDate(caseDetails.workorder[0]?.materialorder[0]?.materialorderlineitems[0]?.quotation_lineitem[0]?.quotation?.QuotationDate) || "N/A"}
            </Text>

            <Text style={styles.label}>Problem Desc</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
              {caseDetails?.ProblemDescription ?? "N/A"}
            </Text>

             <Text style={{width: '30%', fontSize: 8}}>Note</Text>
              <Text style={{width: '2%', fontSize: 8}}>:</Text>
              <Text style={{width: '68%', fontSize: 8, textAlign: 'justify'}}>
                {caseDetails?.CaseProductNote ?? "N/A"}
              </Text>
          </View>

           <View style={styles.rightSection}>
            <Text style={[styles.textSmall, styles.bold]}>
              {caseDetails?.CaseID ?? "N/A"}
            </Text>
            <View style={{borderBottom : 1, borderTop: 1, padding: 2}}>
            <Image src={qrcode} style={styles.qrCode} />
            </View>
          </View>
        </View>

      </Section>

      <Section title="Customer">
        {/* <Text style={[styles.textSmall, { fontWeight: 'bold', marginTop: 20 }]}>Customer</Text> */}
        <View style={{ display: "flex", flexDirection: "row", columnGap: 5 }}>
          <View style={styles.leftSection}>
            <Text style={styles.label}>Company</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
              {caseDetails?.site_account?.Company ?? "N/A"}
            </Text>

            <Text style={styles.label}>Name</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
              {caseDetails?.contact_information?.FirstName ||
              caseDetails?.contact_information?.LastName
                ? `${caseDetails?.contact_information?.FirstName || ""} ${
                    caseDetails?.contact_information?.LastName || ""
                  }`.trim()
                : "N/A"}
            </Text>

            <Text style={styles.label}>Email</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
              {caseDetails?.site_account
                ? caseDetails?.site_account?.Email ?? "N/A"
                : caseDetails?.contact_information?.Email ?? "N/A"}
            </Text>

            <Text style={styles.label}>PIC name</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
              {caseDetails?.contact_information?.FirstName ||
              caseDetails?.contact_information?.LastName
                ? `${caseDetails?.contact_information?.FirstName || ""} ${
                    caseDetails?.contact_information?.LastName || ""
                  }`.trim()
                : "N/A"}
            </Text>

            <Text style={styles.label}>PIC email</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
              {caseDetails?.contact_information?.Email ?? "N/A"}
            </Text>

            <Text style={styles.label}>Address</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
              {caseDetails?.site_account
                ? caseDetails?.site_account?.AddressLine1 ?? "N/A"
                : caseDetails?.contact_information?.AddressLine1 ?? "N/A"}
            </Text>
          </View>
          <View style={styles.rightSection2}>
            <Text style={styles.label}>Phone no</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
              {caseDetails?.site_account
                ? caseDetails?.site_account?.PrimaryPhone ?? "N/A"
                : caseDetails?.contact_information?.Phone ?? "N/A"}
            </Text>

            <Text style={styles.label}>Mobile no</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
              {caseDetails?.site_account
                ? caseDetails?.site_account?.WhatsappNo ?? "N/A"
                : caseDetails?.contact_information?.Mobile ?? "N/A"}
            </Text>

            <Text style={styles.label}>Fax no</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
              {caseDetails?.contact_information?.Fax ?? "N/A"}
            </Text>

            <Text style={styles.label}>PIC phone no.</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
              {caseDetails?.contact_information?.Phone ?? "N/A"}
            </Text>

            <Text style={styles.label}>PIC mobile no.</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
              {caseDetails?.contact_information?.Mobile ?? "N/A"}
            </Text>
          </View>
        </View>
      </Section>

      {/* DP TABLE */}
      <View style={[styles.table, { marginTop: 5 }]}>
        {/* Header */}
        <View style={styles.tableRow}>
          <Text style={[styles.tableHeaderCell, {flex: 0.7}]}>No</Text>
          <Text style={[styles.tableHeaderCell, {flex: 3}]}>Dp Amount</Text>
          <Text style={[styles.tableHeaderCell, {flex: 3}]}>Payment Type</Text>
          <Text style={[styles.tableHeaderCell, {flex: 3.3}]}>Payment Date</Text>
        </View>

        {/* Body */}
        {caseDetails?.down_payment_table?.map((dp, index) => (
          <View style={styles.tableRow} key={index}>
            <Text style={[styles.tableCell, styles.alignCenter,{flex: 0.7}]}>
              {index + 1}
            </Text>
            <View style={[styles.tableCell,{flex: 3, display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}]}>
              <Text>Rp.</Text>
              {FormatRupiah({value: dp?.DPAmount}) ?? "N/A"}
            </View>
            <Text style={[styles.tableCell, styles.alignCenter,{flex: 3}]}>
              {dp?.PaymentType ?? "N/A"}
            </Text>
            <Text style={[styles.tableCell, styles.alignCenter,{flex: 3.3}]}>
              {formatDate(dp?.DPDate) || "N/A"}
            </Text>
          </View>
        ))}
      </View>

      {/* PARTS TABLE */}
      <View style={[styles.table, { marginTop: 5 }]}>
        {/* Header */}
        <View style={styles.tableRow}>
          <Text style={[styles.tableHeaderCell, styles.partsColNo]}>No</Text>
          <Text style={[styles.tableHeaderCell, styles.partsColVendor]}>
            Vendor Part No
          </Text>
          <Text style={[styles.tableHeaderCell, styles.partsColHp]}>
            HP Part No
          </Text>
          <Text style={[styles.tableHeaderCell, styles.partsColPartName]}>
            Part Name
          </Text>
          <Text style={[styles.tableHeaderCell, styles.partsColQty]}>QTY</Text>
          <Text style={[styles.tableHeaderCell, styles.partsColUnitPrice]}>
            Unit Price
          </Text>
          <Text style={[styles.tableHeaderCell, styles.partsColTotalPrice]}>
            Total Price
          </Text>
        </View>

        {/* Body */}
        {caseDetails?.workorder?.length > 0 ? (
          caseDetails.workorder.flatMap((wo) =>
            wo.materialorder.flatMap((mo) =>
              mo.materialorderlineitems.map((line, index) => (
                line.Status === 'Cancelled' ? "N/A" :
                <View style={styles.tableRow} key={line.LineItemID}>
                  <Text style={[styles.tableCell, styles.partsColNo, styles.alignCenter]}>
                    {++counter}
                  </Text>

                  <Text style={[styles.tableCell, styles.partsColVendor, styles.alignCenter]}>
                    {line.servicecatalog_parts?.VendorPartNumber ?? "N/A"}
                  </Text>

                  <Text style={[styles.tableCell, styles.partsColHp, styles.alignCenter]}>
                    {line.PartNumber ?? "N/A"}
                  </Text>

                  <Text style={[styles.tableCell, styles.partsColPartName, styles.alignCenter]}>
                    {line.Description ?? "N/A"}
                  </Text>

                  <Text style={[styles.tableCell, styles.partsColQty, styles.alignCenter]}>
                    {line.Quantity ?? "N/A"}
                  </Text>

                  <View style={[styles.tableCell, styles.partsColUnitPrice,{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}]}>
                    <Text>Rp.</Text>
                    {FormatRupiah({value:line.Price}) ?? "0"}
                  </View>

                  <View style={[styles.tableCell, styles.partsColTotalPrice,{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}]}>
                    <Text>Rp.</Text>
                    {FormatRupiah({value:Number(line.Price) * Number(line.Quantity)}) || 0}
                  </View>
                </View>
              ))
            )
          )
        ) : (
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.partsColNo]} />
            <Text style={[styles.tableCell, styles.partsColVendor]} />
            <Text style={[styles.tableCell, styles.partsColHp]} />
            <Text style={[styles.tableCell, styles.partsColPartName]} />
            <Text style={[styles.tableCell, styles.partsColQty]} />
            <Text style={[styles.tableCell, styles.partsColUnitPrice]} />
            <Text style={[styles.tableCell, styles.partsColTotalPrice]} />
          </View>
        )}


        {/* Footer rows – perfectly aligned with header columns */}

        {/* Labor Fee: colspan=5 */}
        <View style={styles.tableRow}>
          <Text
            style={[styles.tableCell, styles.partsColSpan5, styles.alignRight]}
          >
            Labor Fee : 
          </Text>
          <View style={[styles.tableCell, styles.partsColUnitPrice, {display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}]}>
            <Text>Rp.</Text>
            {FormatRupiah({value:caseDetails?.workorder[0]?.materialorder[0]?.materialorderlineitems[0]?.quotation_lineitem[0]?.quotation?.LaborFee || caseDetails?.invoicetable[0]?.AmountReceive})}
          </View>
          <View style={[styles.tableCell, styles.partsColTotalPrice, {display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}]}>
            <Text>Rp.</Text>
            {FormatRupiah({value:caseDetails?.workorder[0]?.materialorder[0]?.materialorderlineitems[0]?.quotation_lineitem[0]?.quotation?.LaborFee || caseDetails?.invoicetable[0]?.AmountReceive})}
          </View>
        </View>

       

        {/* Sub Total: colspan=6 */}
        <View style={styles.tableRow}>
          <Text
            style={[styles.tableCell, styles.partsColSpan6, styles.alignRight]}
          >
            Sub Total :
          </Text>
          <View style={[styles.tableCell, styles.partsColTotalPrice, {display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}]}>
            <Text>Rp.</Text>
            {FormatRupiah({value:caseDetails?.workorder[0]?.materialorder[0]?.materialorderlineitems[0]?.quotation_lineitem[0]?.quotation?.Subtotal || "0"})}
          </View>
        </View>

        {/* VAT: colspan=6 */}
        <View style={styles.tableRow}>
          <Text
            style={[styles.tableCell, styles.partsColSpan6, styles.alignRight]}
          >
            VAT :
          </Text>
          <View style={[styles.tableCell, styles.partsColTotalPrice, {display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}]}>
            <Text>Rp.</Text>
            {FormatRupiah({value:caseDetails?.workorder[0]?.materialorder[0]?.materialorderlineitems[0]?.quotation_lineitem[0]?.quotation?.VATAmount || "0"})}
          </View>
        </View>

      
        {/* Total: colspan=6 */}
        <View style={styles.tableRow}>
          <Text
            style={[styles.tableCell, styles.partsColSpan6, styles.alignRight]}
          >
            Total :
          </Text>
          <View style={[styles.tableCell, styles.partsColTotalPrice, {display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}]}>
            <Text>Rp.</Text>
            {FormatRupiah({value:caseDetails?.workorder[0]?.materialorder[0]?.materialorderlineitems[0]?.quotation_lineitem[0]?.quotation?.GrandTotal || "0"})}
          </View>
        </View>

       {/* DP: colspan=6 */}
        <View style={styles.tableRow}>
          <Text
            style={[styles.tableCell, styles.partsColSpan6, styles.alignRight]}
          >
            DP :
          </Text>
          <View style={[styles.tableCell, styles.partsColTotalPrice, {display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}]}>
            <Text>Rp.</Text>
            {FormatRupiah({value:caseDetails?.down_payment_table.reduce((sum, row) => 
              sum + Number(row.DPAmount) || 0, 0
            )})}
          </View>
        </View>

        <View style={styles.tableRow}>
          <Text
            style={[styles.tableCell, styles.partsColSpan6, styles.alignRight]}
          >
            Balance Due :
          </Text>
          <View style={[styles.tableCell, styles.partsColTotalPrice, {display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}]}>
            <Text>Rp.</Text>
            {FormatRupiah({value:(caseDetails?.workorder[0]?.materialorder[0]?.materialorderlineitems[0]?.quotation_lineitem[0]?.quotation?.GrandTotal) - (caseDetails?.down_payment_table.reduce((sum, row) => sum + Number(row.DPAmount), 0)) ? 
                            (caseDetails?.workorder[0]?.materialorder[0]?.materialorderlineitems[0]?.quotation_lineitem[0]?.quotation?.GrandTotal) - (caseDetails?.down_payment_table.reduce((sum, row) => sum + Number(row.DPAmount), 0)) : 0
                          })}
          </View>
        </View>
      </View>

      <View style={{ display: "flex", flexDirection: "row", columnGap: 2 }} >
        <View style={styles.leftSection} >
          <Text style={{ fontSize: 10, width: "10%", fontWeight: "bold" }}>
            Note
          </Text>
          <Text style={styles.colon}>:</Text>
          <Text style={[styles.value]}>
          </Text>
        </View>
      </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <View style={{ flexDirection: "column", alignItems: "center" }} >
            <Text style={[styles.textSmall]}>
              {formatDate(caseDetails?.workorder[0]?.materialorder[0]?.materialorderlineitems[0]?.quotation_lineitem[0]?.quotation?.invoicetable[0]?.CreatedOn)}
            </Text>
            <Image style={{ width: 120, height: 60 }} />
            <Text style={styles.textSmall}>
              {
                caseDetails?.createdByUser?.ResourceId == 'IDY_SB Kokas' ?  "AUDYA" : 
                caseDetails?.createdByUser?.ResourceId == 'IDY_SB Mangga Dua' ?  "CRUSSITA" : 
                caseDetails?.createdByUser?.ResourceId == 'IDY_SB Gubeng' ?  "ELLY" :
                "N/A"
              }
            </Text>
            <Text style={styles.textSmall}>
              -----------------------------------------
            </Text>
            <Text style={[styles.textSmall]}>
              Cashier 
            </Text>
          </View>
         
      </View>
          <Text style={[styles.textSmall, {marginTop: 10}]}>
            * Harga sudah termasuk PPN.
          </Text>
          <View 
          style={{
            flexDirection: "column",
          }}
        >
          <Text style={styles.textSmall}>
            Transfer Payment To : 
          </Text>
          <Text style={styles.textSmall}>
            BCA-KCP Artha Gading
          </Text>
          <Text style={styles.textSmall}>
            A/N : PT. JAVA ABADI GEMILANG
          </Text>
          <Text style={styles.textSmall}>
            A/C : 8400039195
          </Text>
           <View style={{display: 'flex', alignItems: 'flex-end'}}>
              <View style={{flexDirection: 'row', alignItems:'center', gap: 10}}>
              <Text style={{fontSize: 10, fontWeight: 'bold'}}>
                Partner Of 
              </Text>
                <Image src="/hp.png" style={{ width: 34, height: 34 }} />
              </View>
            </View>
        </View>
    </Page>
  </Document>
);
