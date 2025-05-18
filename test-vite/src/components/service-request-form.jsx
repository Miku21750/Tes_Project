// ServiceRequestPDF.js
import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
  Link,
} from '@react-pdf/renderer';

// Example custom font (optional)
Font.register({
  family: 'Helvetica',
  fonts: [{ src: 'https://fonts.gstatic.com/s/helvetica/Helvetica.ttf' }],
});


const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 30,
    gap: 5,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    maxWidth: '600px',
    margin: 'auto',
    flexDirection: 'column',
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  textSmall: {
    fontSize: 9,
    color: 'gray',
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
    width: 60,
    height: 60,
  },
  link: {
    fontSize: 7,
    color: 'blue',
  },
  disclaimerText: {
    fontSize: 7,
    marginBottom: 5,
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
    justifyContent: 'center',
  },
  rightSection2: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 2,
  },
  label: {
    width: '40%', // 1 of 4 columns
    fontSize: 9,
  },
  label2: {
    width: '20%', // 1 of 4 columns
    fontSize: 9,
  },
  value: {
    width: '60%', // col-span-3
    fontSize: 9,
  },
  value2: {
    width: '80%', // col-span-3
    fontSize: 9,
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableHeader: {
    backgroundColor: '#e5e7eb', // Tailwind's gray-200
  },
  tableCell: {
    flex: 1,
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
    borderColor: '#ccc',
    padding: 2,
    fontSize: 7,
    textAlign: 'center',
    backgroundColor: '#f3f4f6', // Tailwind's gray-100
    fontWeight: 'bold',
  },
});
const ServiceRequestPDF = ({ nama, caseDetails }) =>

(
  <Document>
    <Page style={styles.container}>
      <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center', marginBottom: 4 }}>
        <Image src="/hp.png" style={styles.logo} />
        <View>
          <Text style={styles.sectionHeader}>PT.JAVA ABADI GEMILANG</Text>
          <Text style={styles.textSmall}>Prudential Centre Kota Casablanka Lt. 5 Unit C- E, Jl. Casablanca</Text>
          <Text style={styles.textSmall}>Kav.88</Text>
          <Text style={styles.textSmall}>Jakarta Selatan, 12870, Indonesia</Text>
          <Text style={styles.textSmall}>Telp : (+6221) 081318521007 / 081318521006 - HP : 0811970666</Text>
        </View>
        <Text style={[styles.sectionHeader]}>SERVICE REQUEST FORM</Text>
      </View>

      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <View style={styles.leftSection}>
          <Text style={styles.label}>Case Type</Text>
          <Text style={[styles.value]}>: {caseDetails?.CaseType ?? 'N/A'}</Text>

          <Text style={styles.label}>Warranty Status</Text>
          <Text style={[styles.value]}>: {caseDetails?.WarrantyStatus ?? 'N/A'}
            
          </Text>

          <Text style={styles.label}>Received Date</Text>
          <Text style={[styles.value]}>
            : {caseDetails?.CaseClosedDate ? new Date(caseDetails.CaseClosedDate).toLocaleDateString() : 'N/A'}
          </Text>

          <Text style={styles.label}>Problem Desc</Text>
          <Text style={[styles.value]}>: {caseDetails?.ProblemDescription ?? 'N/A'}</Text>

          <Text style={styles.label}>Note</Text>
          <Text style={[styles.value]}>: {caseDetails?.CaseNote ?? 'N/A'}</Text>
        </View>

        <View style={styles.rightSection}>
          <Text style={[styles.textSmall, styles.bold]}>5000000081</Text>
          <Image src="/random_qr.png" style={styles.qrCode} />
        </View>
      </View>

      {/* Customer Section */}
      <Text style={[styles.textSmall, { fontWeight: 'bold', marginTop: 20 }]}>Customer</Text>
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <View style={styles.leftSection}>
          <Text style={styles.label}>Company</Text>
          <Text style={[styles.value]}>
            : {caseDetails?.site_account?.Company ?? 'N/A'}
          </Text>

          <Text style={styles.label}>Name</Text>
          <Text style={[styles.value]}>
            : {(caseDetails?.contact_information?.FirstName +" "+ caseDetails?.contact_information?.LastName) ?? 'N/A'}
          </Text>

          <Text style={styles.label}>Email</Text>
          <Text style={[styles.value]}>
            : {caseDetails?.site_account ? caseDetails?.site_account?.Email  ?? 'N/A' : caseDetails?.contact_information?.Email  ?? 'N/A' }
          </Text>

          <Text style={styles.label}>PIC name</Text>
          <Text style={[styles.value]}>
            : {(caseDetails?.contact_information?.FirstName  + " " + caseDetails?.contact_information?.LastName) ?? 'N/A'}
          </Text>

          <Text style={styles.label}>PIC email</Text>
          <Text style={[styles.value]}>
            : {caseDetails?.contact_information?.Email ?? 'N/A'}
          </Text>

          <Text style={styles.label}>Address</Text>
          <Text style={[styles.value]}>
            : {caseDetails?.site_account ? caseDetails?.site_account?.AddressLine1  ?? 'N/A' : caseDetails?.contact_information?.AddressLine1  ?? 'N/A' }
          </Text>
        </View>
        <View style={styles.rightSection2}>
          <Text style={styles.label}>Phone no</Text>
          <Text style={[styles.value]}>
            : {caseDetails?.site_account ? caseDetails?.site_account?.PrimaryPhone  ?? 'N/A' : caseDetails?.contact_information?.Phone  ?? 'N/A' }
          </Text>

          <Text style={styles.label}>Mobile no</Text>
          <Text style={[styles.value]}>
            : {caseDetails?.site_account ? caseDetails?.site_account?.WhatsappNo  ?? 'N/A' : caseDetails?.contact_information?.Mobile  ?? 'N/A' }
          </Text>

          <Text style={styles.label}>Fax no</Text>
          <Text style={[styles.value]}>
            : {caseDetails?.contact_information?.Fax ?? 'N/A'}
          </Text>

          <Text style={styles.label}>PIC phone no.</Text>
          <Text style={[styles.value]}>
            : {caseDetails?.contact_information?.Phone ?? 'N/A'}
          </Text>

          <Text style={styles.label}>PIC mobile no.</Text>
          <Text style={[styles.value]}>
            : {caseDetails?.contact_information?.Mobile ?? 'N/A'}
          </Text>

        </View>
      </View>

      {/* Product Section */}
      <Text style={[styles.textSmall, { fontWeight: 'bold', marginTop: 20 }]}>Product</Text>
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <View style={styles.leftSection}>
          <Text style={styles.label}>Serial no</Text>
          <Text style={[styles.value]}>
            : {caseDetails?.asset_information?.SerialNumber ?? 'N/A'}
          </Text>

          <Text style={styles.label}>Product no</Text>
          <Text style={[styles.value]}>
            : {caseDetails?.asset_information?.ProductNumber ?? 'N/A'}
          </Text>

          <Text style={styles.label}>Product name</Text>
          <Text style={[styles.value]}>
            : {caseDetails?.asset_information?.product_information?.ProductName ?? 'N/A'}
          </Text>
        </View>

        <View style={styles.rightSection2}>
          <Text style={styles.label}>Product tower</Text>
          <Text style={[styles.value]}>
            : {caseDetails?.asset_information?.product_information?.product_type?.ProductTower ?? 'N/A'}
          </Text>

          <Text style={styles.label}>Product group</Text>
          <Text style={[styles.value]}>
            : {caseDetails?.asset_information?.product_information?.product_type?.ProductGroup ?? 'N/A'}
          </Text>

          <Text style={styles.label}>Product type</Text>
          <Text style={[styles.value]}>
            : {caseDetails?.asset_information?.product_information?.product_type?.ProductType ?? 'N/A'}
          </Text>
        </View>
      </View>

<View style={[styles.tableRow, styles.tableHeader, {marginTop: 20}]}>
          <Text style={styles.tableHeaderCell}>Accessories</Text>
          <Text style={styles.tableHeaderCell}>Note</Text>
          <Text style={styles.tableHeaderCell}>CT/ SN Code</Text>
        </View>
      {caseDetails?.accessory?.length > 0 ? (
        caseDetails.accessory.map((item, index) => (
          <View style={styles.tableRow} key={index}>
            <Text style={styles.tableCell}>{item.Accessories ?? 'N/A'}</Text>
            <Text style={styles.tableCell}>{item.Note ?? 'N/A'}</Text>
            <Text style={styles.tableCell}>{item.CT_SNCode ?? 'N/A'}</Text>
          </View>
        ))
      ) : (
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>No Data</Text>
          <Text style={styles.tableCell}>-</Text>
          <Text style={styles.tableCell}>-</Text>
        </View>
      )}


      <Text style={[styles.textSmall, { fontWeight: 'bold' }]}>Notification and confirmation</Text>
      <View style={{ display: 'flex', flexDirection: 'row' }}>

        <View style={styles.leftSection}>
          <Text style={styles.label2}>Unit Garansi</Text>
          <Text style={[styles.value2]}>:Lamanya pengerjaan perbaikan sekitar 3 hari kerja (tergantung tersedianya suku cadang)</Text>
          <Text style={styles.label2}>Unit Tidak Garansi</Text>
          <Text style={[styles.value2]}>: • Biaya pengecekan dibayar di muka dan tidak dapat dikembalikan. </Text>
          <Text style={styles.label2}></Text>
          <Text style={[styles.value2]}>• Surat Penawaran Perbaikan akan dikirim sekitar 3 hari kerja setelah peralatan diterima. Lamanya pengerjaan perbaikan sekitar 3
            hari kerja setelah persetujuan atas Surat Penawaran Perbaikan (tergantung tersedianya suku cadang)</Text>
        </View>
      </View>
      <Text style={[styles.sectionHeader, styles.textCenter]}>Disclaimer Statement</Text>

      <View style={{}}>
        <Text style={[styles.bold, styles.textSmall]}>Informasi Untuk Pelanggan :</Text>
        <Text style={[styles.bold, styles.textSmall]}>Saya {(caseDetails?.contact_information?.FirstName +" "+ caseDetails?.contact_information?.LastName) ?? 'Customer'} yang bertanda tangan di bawah ini menyetujui bahwa:</Text>
        <Text style={[styles.bold, styles.textSmall]}>
          Data yang tersimpan dalam peralatan dapat terhapus selama proses perbaikan peralatan berlangsung. Pada saat dilakukan system atau
          operating system recovery, setting peralatan akan berubah mengikuti setting awal dari pabrik.
        </Text>
        <Text style={styles.textSmall}>
          Walaupun HP selalu melakukan pencegahan terhadap kerusakan pada Data atau terhapusnya Data, kami sangat menyarankan Pelanggan untuk melakukan
          Backup Data sendiri sebelum peralatan disampaikan kepada kami. Dengan demikian pelanggan mempunyai Backup Data untuk melakukan Data Recovery jika
          selama proses perbaikan peralatan berlangsung Data pelanggan terhapus oleh System atau Operating System.
        </Text>
        <Text style={styles.textSmall}>
          HP tidak memberikan jaminan proteksi Data pelanggan dan HP tidak bertanggungjawab jika terjadi kerusakan pada Data atau terhapusnya Data dari peralatan
          pelanggan.
        </Text>
      </View>


      {/* Signature section */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
          <Text style={[styles.textSmall, { marginBottom: 30 }]}>Received By</Text>
          <Text style={styles.textSmall}>--------------------------------------------</Text>
          <Text style={styles.textSmall}>frondesk-1</Text>
        </View>
        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
          <Image src="/random_qr.png" style={styles.qrCode} />
          <Text style={[styles.textSmall, styles.bold]}>Check Repair Status</Text>
        </View>
        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
          <Text style={[styles.textSmall, { marginBottom: 30 }]}>Received By</Text>
          <Text style={styles.textSmall}>--------------------------------------------</Text>
          <Text style={styles.textSmall}>{(caseDetails?.contact_information?.FirstName +" "+ caseDetails?.contact_information?.LastName) ?? 'Customer'}</Text>
        </View>
      </View>

      <Text style={styles.textSmall}>
        • Check status service silahkan klik{' '}
        <Link style={styles.link} src="https://hp.care/digital-ID">https://hp.care/digital-ID</Link> or scan the QR code above.
      </Text>

      <Text style={styles.textSmall}>• Apabila pelayanan kami kurang memuaskan untuk case 5000000081, silahkan sampaikan melalui email ke <Link style={styles.link} src="mailto:escalation.id@hp.com">escalation.id@hp.com</Link></Text>

      <Text style={[styles.textSmall, { marginBottom: 20 }]}>• Apabila dikemudian hari membutuhkan bantuan teknis, silahkan klik{' '}
        <Link style={styles.link} src="https://hp.care/digital-ID">https://hp.care/digital-ID</Link>
      </Text>
      <Text style={{ borderBottom: '1px solid #ccc' }}></Text>
      <Text style={styles.textSmall}>Tanda tangan Anda merupakan persetujuan terhadap syarat-syarat perbaikan di balik halaman ini</Text>
    </Page>
  </Document>
);



export default ServiceRequestPDF;
