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
import { formatDate } from "../lib/utils";

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
    fontSize: 11,
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
  <View style={styles.sectionContainer}>
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

export const FormatRupiah = ({value}) => {
  return (
    <View>
      <Text>{new Intl.NumberFormat("id-ID", {
        minimumFractionDigits: 0,
      }).format(value)}</Text>
    </View>
  )
}

let counter = 0;

export const QuotationInvoice = ({
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
       <View style={{ flex: 1, justifyContent: "space-between", flexDirection: "row" }}>
        <View>
          <Text style={styles.sectionHeader}>PT.JAVA ABADI GEMILANG</Text>
          <Text style={[styles.textSmall, {flexWrap: 'wrap', maxWidth: 200}]}>
            {caseDetails?.createdByUser?.resource?.AddressLine}
          </Text>
          <Text style={styles.textSmall}>
            Telp : {caseDetails?.createdByUser?.resource?.Phone}
          </Text>
        </View>
           <Text style={[styles.sectionHeader, {marginTop: 20}]}>QUOTATION / PROFORMA INVOICE</Text>
        </View>
      </View>

      <Section title="Case Info">
        <View style={{ display: "flex", flexDirection: "row" }}>
          <View style={styles.leftSection}>
            <Text style={[styles.label, { fontWeight: "bold", fontSize: 12 }]}>
              Quotation no.
            </Text>
            <Text style={[styles.colon, { fontWeight: "bold", fontSize: 10 }]}>
              :
            </Text>
            <Text style={[styles.value, { fontWeight: "bold", fontSize: 10 }]}>
              {caseDetails.workorder[0]?.materialorder[0]?.materialorderlineitems[0]?.quotation_lineitem[0]?.QuotationNo ?? "N/A"}
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

      <Section title="Product">
        <View style={{ display: "flex", flexDirection: "row", columnGap: 5 }}>
          <View style={styles.leftSection}>
            <Text style={styles.label}>Serial no</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
              {caseDetails?.asset_information?.SerialNumber ?? "N/A"}
            </Text>

            <Text style={styles.label}>Product no</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
              {caseDetails?.asset_information?.ProductNumber ?? "N/A"}
            </Text>

            <Text style={styles.label}>Product name</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
              {caseDetails?.asset_information?.product_information
                ?.ProductName ?? "N/A"}
            </Text>
          </View>

          <View style={styles.rightSection2}>
            <Text style={styles.label}>Product tower</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
              {caseDetails?.asset_information?.product_information?.product_type
                ?.ProductTower ?? "N/A"}
            </Text>

            <Text style={styles.label}>Product group</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
              {caseDetails?.asset_information?.product_information?.product_type
                ?.ProductGroup ?? "N/A"}
            </Text>

            <Text style={styles.label}>Product type</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
              {caseDetails?.asset_information?.product_information?.product_type
                ?.ProductType ?? "N/A"}
            </Text>
          </View>
        </View>
      </Section>

      <View style={[styles.tableRow, styles.tableHeader]}>
        <Text style={styles.tableHeaderCell}>Accessories</Text>
        <Text style={styles.tableHeaderCell}>Note</Text>
        <Text style={styles.tableHeaderCell}>CT/ SN Code</Text>
      </View>
      {caseDetails?.accessory?.length > 0 ? (
        caseDetails.accessory.map((item, index) => (
          <View style={styles.tableRow} key={index}>
            <Text style={styles.tableCell}>{item.Accessories ?? "N/A"}</Text>
            <Text style={styles.tableCell}>{item.Note ?? "N/A"}</Text>
            <Text style={styles.tableCell}>{item.CT_SNCode ?? "N/A"}</Text>
          </View>
        ))
      ) : (
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>-</Text>
          <Text style={styles.tableCell}>-</Text>
          <Text style={styles.tableCell}>-</Text>
        </View>
      )}

      {/* PARTS TABLE */}
      <View style={[styles.table, { marginTop: 10 }]}>
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
              mo.materialorderlineitems.map((line) => (
                line.Status === 'Cancelled' ? "N/A" :
                <View style={styles.tableRow} key={line.LineItemID}>
                  <Text style={[styles.tableCell, styles.partsColNo, styles.alignCenter]}>
                    {++counter}
                  </Text>

                  <Text style={[styles.tableCell, styles.partsColVendor,styles.alignCenter]}>
                    {line.servicecatalog_parts?.VendorPartNumber ?? "N/A"}
                  </Text>

                  <Text style={[styles.tableCell, styles.partsColHp, styles.alignCenter]}>
                    {line.PartNumber ?? "N/A"}
                  </Text>

                  <Text style={[styles.tableCell, styles.partsColPartName,styles.alignCenter]}>
                    {line.Description ?? "N/A"}
                  </Text>

                  <Text style={[styles.tableCell, styles.partsColQty,styles.alignCenter]}>
                    {line.Quantity ?? "N/A"}
                  </Text>

                  <View style={[styles.tableCell, styles.partsColUnitPrice, {display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}]}>
                    <Text>Rp.</Text>
                    {FormatRupiah({value: line.Price}) ?? 0}
                  </View>

                  <View style={[styles.tableCell, styles.partsColTotalPrice,{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}]}>
                    <Text>Rp.</Text>
                    {FormatRupiah({value: Number(line.Price) * Number(line.Quantity)}) || 0}
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
            {FormatRupiah({value: caseDetails?.workorder[0]?.materialorder[0]?.materialorderlineitems[0]?.quotation_lineitem[0]?.quotation?.LaborFee || "0"})}
          </View>
          <View style={[styles.tableCell, styles.partsColTotalPrice, {display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}]}>
            <Text>Rp.</Text>
            {FormatRupiah({value: caseDetails?.workorder[0]?.materialorder[0]?.materialorderlineitems[0]?.quotation_lineitem[0]?.quotation?.LaborFee || "0"})}
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
            {FormatRupiah({value: caseDetails?.workorder[0]?.materialorder[0]?.materialorderlineitems[0]?.quotation_lineitem[0]?.quotation?.Subtotal || "0"})}
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
          {caseDetails?.workorder[0]?.materialorder[0]?.materialorderlineitems[0]?.quotation_lineitem[0]?.quotation?.VatValue ? 
            FormatRupiah({value: caseDetails?.workorder[0]?.materialorder[0]?.materialorderlineitems[0]?.quotation_lineitem[0]?.quotation?.VATAmount})  : "0"
          }
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
            {FormatRupiah({value: caseDetails?.workorder[0]?.materialorder[0]?.materialorderlineitems[0]?.quotation_lineitem[0]?.quotation?.GrandTotal || "0"})}
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
              {FormatRupiah({value: caseDetails?.down_payment_table.reduce((sum, row) => 
                          sum + Number(row.DPAmount) || 0, 0
                )})}
          </View>
        </View>

       {/* DP: colspan=6 */}
        <View style={styles.tableRow}>
          <Text
            style={[styles.tableCell, styles.partsColSpan6, styles.alignRight]}
          >
            Balance Due :
          </Text>
          <View style={[styles.tableCell, styles.partsColTotalPrice, {display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}]}>
             <Text>Rp.</Text>
              {(caseDetails?.workorder[0]?.materialorder[0]?.materialorderlineitems[0]?.quotation_lineitem[0]?.quotation?.GrandTotal) - (caseDetails?.down_payment_table.reduce((sum, row) => sum + Number(row.DPAmount), 0)) ? 
                FormatRupiah({value: (caseDetails?.workorder[0]?.materialorder[0]?.materialorderlineitems[0]?.quotation_lineitem[0]?.quotation?.GrandTotal) - (caseDetails?.down_payment_table.reduce((sum, row) => sum + Number(row.DPAmount), 0))}) : "0"
              }
          </View>
        </View>
      </View>


      <View style={{ display: "flex", flexDirection: "row", columnGap: 2}} >
        <View style={styles.leftSection} >
          <Text style={{ fontSize: 10, width: "10%", fontWeight: "bold" }}>
            Note
          </Text>
          <Text style={styles.colon}>:</Text>
          <Text style={[styles.value]}>
          </Text>
        </View>
      </View>
        
      <Section title="Terms and Conditions" >
        <View style={{ display: "flex", flexDirection: "row", columnGap: 5 }}>
          <View style={styles.leftSection}>
            <Text style={styles.label}>Validity</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
              7 (seven) calender days
            </Text>
            <Text style={styles.label}>Delivery Time</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
              2 (two) weeks from date of PO confirmation & subject to spare part availibility
            </Text>
            <Text style={styles.label}>Payment</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
            {caseDetails.workorder[0]?.materialorder[0]?.materialorderlineitems[0]?.quotation_lineitem[0]?.quotation?.invoicetable[0]?.PaymentType ? 
              caseDetails.workorder[0]?.materialorder[0]?.materialorderlineitems[0]?.quotation_lineitem[0]?.quotation?.invoicetable[0]?.PaymentType : 
              "Cash / Debit / Qris / Credit Card / Transfer"  
            }
            </Text>
            <Text style={styles.label}>Warranty</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
              1 (one) month for the same part
            </Text>
            <Text style={styles.label}>Cancellation Fee</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
              Rp. 121.000,
            </Text>
            <Text style={styles.label}>Others</Text>
            <Text style={styles.colon}>:</Text>
            <List items={[
              "Defective part(s) should be returned to HP",
              "No cancellation accepted after PO confirmation (full quotation charge will apply after PO confirmation)",
              "Any damaged part(s) that has been replaced shall be the property of HP Indonesia (Suku cadang yang rusak pada barang yang diperbaiki akan menjadi milik HP Indonesia)",
            ]}/>
          </View>
        </View>
      </Section>
        
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "column", alignItems: "center" }} >
            <Text style={[styles.textSmall, { marginBottom: 10 }]}>
              Sincerely yours
            </Text>
            <Image src={caseDetails?.createdByUser?.Signature} style={{ width: 120, height: 60 }} />
            <Text style={styles.textSmall}>
              --------------------------------------------
            </Text>
            <Text style={styles.textSmall}>
              {caseDetails?.createdByUser?.Name}
            </Text>
          </View>
          <View style={{ flexDirection: "column", alignItems: "center" }} >
            <Text style={[styles.textSmall, { marginBottom: 10 }]}>
              Accepted by
            </Text>
            <Image src={customerSignature} style={{ width: 120, height: 60 }} />
            <Text style={styles.textSmall}>
              --------------------------------------------
            </Text>
            <Text style={styles.textSmall}>
              {caseDetails?.contact_information?.FirstName ||
              caseDetails?.contact_information?.LastName
                ? `${caseDetails?.contact_information?.FirstName || ""} ${
                    caseDetails?.contact_information?.LastName || ""
                  }`.trim()
                : "N/A"}
            </Text>
          </View>
      </View>
          <Text style={styles.textSmall}>
            * This PDF Quotation auto generated by system.
          </Text>
        <View style={{display: 'flex', alignItems: 'flex-end'}}>
          <View style={{flexDirection: 'row', alignItems:'center', gap: 10}}>
          <Text style={{fontSize: 10, fontWeight: 'bold'}}>
            Partner Of 
          </Text>
            <Image src="/hp.png" style={{ width: 34, height: 34 }} />
          </View>
        </View>
    </Page>
  </Document>
);
