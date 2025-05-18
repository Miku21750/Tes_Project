import { PDFViewer } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';

export default function PDFWrapper() {
  const [PDFDownloadLink, setPDFDownloadLink] = useState(null);
  const [ServiceRequestPDF, setServiceRequestPDF] = useState(null);

  useEffect(() => {
    const loadPDF = async () => {
      const pdf = await import('@react-pdf/renderer');
      const doc = await import('./service-request-form');
      setPDFDownloadLink(() => pdf.PDFDownloadLink);
      setServiceRequestPDF(() => doc.default);
    };

    loadPDF();
  }, []);

  if (!PDFDownloadLink || !ServiceRequestPDF) return <p>Loading PDF...</p>;

  return (
    <div className="">
        <PDFViewer width="100%" height="600px">
            <ServiceRequestPDF  />
        </PDFViewer>
        <PDFDownloadLink
          document={<ServiceRequestPDF nama="Ferid" />}
          fileName="service_request_form.pdf"
        >
          {({ loading }) => (loading ? 'Generating PDF...' : 'Download PDF')}
        </PDFDownloadLink>
    </div>
  );
}
