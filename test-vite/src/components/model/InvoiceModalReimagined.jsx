// InvoiceDialog.jsx

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import CaseField from "../CaseField";
import { Textarea } from "../ui/textarea";
import { SearchCommandBlock } from "../sc-select";
import { Checkbox } from "../ui/checkbox";
import { formatAccountingRupiah, formatDateForInput } from "@/lib/utils";
import { toast } from "sonner";
import ApiCustomer from "@/api";
import { useServiceCaseStore } from "../../hooks/useServiceCaseStore";
import { useAuth } from "../../context/auth-context";

const AMOUNT_DIFF_REASON_OPTIONS = [
  "Cancellation Fee (part mahal)",
  "Discount",
  "Free absorb by HP",
  "Free cancel (Onsite)",
  "Free EOS/Not support ID",
  "Free harga tidak ekonomis",
  "Free rerepair",
  "Free unit Nexgen",
  "Free void warranty",
  "Partial part",
  "PPh23 / VAT",
  "Service Fee / Labor only",
  "Warranty approved",
];

const buildInitialForm = (invoice, quotation) => {
  const today = formatDateForInput(new Date().toISOString());
  const quotationNo = quotation?.quotationNo ?? "";
  const grandTotalRaw = quotation?.grandTotal ?? "";
  const receiveRaw = invoice?.amountReceive ?? (grandTotalRaw || "");

  const grandTotalNumber = Number(grandTotalRaw || 0);
  const amountReceiveNumber = Number(receiveRaw || 0);
  const defaultDiff =
    grandTotalRaw && receiveRaw !== ""
      ? (grandTotalNumber - amountReceiveNumber).toFixed(2)
      : "0";

  return {
    invoiceNo: invoice?.invoiceNo ?? "",
    quotationNo,
    amountReceive: receiveRaw ?? "",
    amountDiff: invoice?.amountDiff ?? defaultDiff,
    amountDiffReason: invoice?.amountDiffReason ?? "",
    paymentType: invoice?.paymentType ?? "",
    amountReceiveDate: invoice?.amountReceiveDate
      ? formatDateForInput(invoice.amountReceiveDate)
      : today,
    amountReceiveNote: invoice?.amountReceiveNote ?? "",
    sendWa: invoice?.sendWa ?? false,
    sendEmail: invoice?.sendEmail ?? false,
    sendInvoice: invoice?.sendInvoice ?? false,
    sendErf: invoice?.sendErf ?? false,
  };
};

const InvoiceDialog = () => {
  const { user } = useAuth();
  const open = useServiceCaseStore((s) => s.invoiceDialogOpen);
  const setInvoiceDialogOpen = useServiceCaseStore((s) => s.setInvoiceDialogOpen);
  const invoiceData = useServiceCaseStore((s) => s.invoiceData);
  const invoiceLoading = useServiceCaseStore((s) => s.invoiceLoading);
  const fetchInvoiceData = useServiceCaseStore((s) => s.fetchInvoiceData);
  const caseDetails = useServiceCaseStore((s) => s.caseDetails);
  
  const totalDpAmount = useServiceCaseStore((s) => s.totalDpAmount());
  const quotation = invoiceData?.quotation;
  const invoice = invoiceData?.invoice;

  const [step, setStep] = useState("form");
  const [form, setForm] = useState(() => buildInitialForm(invoice, quotation));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const grandTotalNumber = useMemo(() => {
    if (!quotation?.grandTotal) return 0;
    let parsed = Number(quotation.grandTotal);
    if(totalDpAmount !== 0) parsed = parsed - Number(totalDpAmount)
    return Number.isNaN(parsed) ? 0 : parsed;
  }, [quotation, totalDpAmount]);

  // fetch invoice data whenever dialog is opened
  useEffect(() => {
    if (!open || !caseDetails?.CaseID) return;
  }, [open, caseDetails?.CaseID, fetchInvoiceData]);

  useEffect(() => {
    if (!open) {
      setStep("form");
      setErrors({});
    }
  }, [open]);

  useEffect(() => {
    setForm(buildInitialForm(invoice, quotation));
    setErrors({});
    setStep("form");
  }, [invoice, quotation]);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAmountReceiveChange = (value) => {
    setForm((prev) => {
      const next = { ...prev, amountReceive: value };
      const parsed = Number(value);
      if (!Number.isNaN(parsed)) {
        const diff = (grandTotalNumber - parsed).toFixed(2);
        next.amountDiff = diff;
        if (Math.abs(Number(diff)) < 0.0001) {
          next.amountDiffReason = "";
        }
      }
      return next;
    });
  };

  const validateForm = () => {
    const nextErrors = {};

    // if (!quotation?.quotationNo) {
    //   nextErrors.quotationNo = "Quotation belum tersedia.";
    // }

    if (form.amountReceive === "" || Number.isNaN(Number(form.amountReceive))) {
      nextErrors.amountReceive = "Amount receive wajib diisi dengan angka.";
    }

    if (
      Number(form.amountDiff || 0) !== 0 &&
      (!form.amountDiffReason || form.amountDiffReason.trim() === "")
    ) {
      nextErrors.amountDiffReason =
        "Pilih alasan ketika terdapat selisih nominal.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      setStep("confirm");
    }
  };

  const handleConfirm = async () => {
    if (!caseDetails?.CaseID || !user?.id) return;
    // if (!quotation?.quotationNo) return;
    if (submitting) return;

    const payload = {
      invoiceNo: form.invoiceNo || undefined,
      quotationNo: form.quotationNo,
      amountReceive: form.amountReceive,
      amountDiff: form.amountDiff,
      amountDiffReason: form.amountDiffReason,
      paymentType: form.paymentType,
      amountReceiveDate: form.amountReceiveDate,
      amountReceiveNote: form.amountReceiveNote,
      sendWa: form.sendWa,
      sendEmail: form.sendEmail,
      sendInvoice: form.sendInvoice,
      sendErf: form.sendErf,
    };

    const hasInvoice = Boolean(payload.invoiceNo);
    const endpoint = hasInvoice
      ? `/api/invoice-information/${payload.invoiceNo}`
      : "/api/invoice-information";
    const method = hasInvoice ? "patch" : "post";
    const requester =
      method === "patch"
        ? ApiCustomer.patch.bind(ApiCustomer)
        : ApiCustomer.post.bind(ApiCustomer);

    const requestBody = {
      ...payload,
      caseId: caseDetails.CaseID,
    };

    if (!hasInvoice) {
      requestBody.createdBy = user.id;
    }

    try {
      setSubmitting(true);
      const response = await requester(endpoint, requestBody);
      toast.success(
        hasInvoice
          ? "Invoice berhasil diperbarui."
          : "Invoice berhasil dibuat."
      );
      await fetchInvoiceData();
      setInvoiceDialogOpen(false);
    } catch (error) {
      console.error("Failed to save invoice:", error);
      const message =
        error?.response?.data?.message ?? "Gagal menyimpan invoice.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderLoading = () => (
    <div className="flex min-h-[200px] items-center justify-center text-sm text-muted-foreground">
      Mengambil data invoice...
    </div>
  );

  // const renderEmptyQuotation = () => (
  //   <div className="flex min-h-[200px] flex-col items-center justify-center text-center text-sm text-muted-foreground">
  //     <p>Belum ada quotation untuk case ini.</p>
  //     <p className="text-xs">
  //       Buat quotation terlebih dahulu sebelum membuat invoice.
  //     </p>
  //   </div>
  // );

  const renderForm = () => (
    <div className="grid gap-6 md:grid-cols-2 items-start">
      {/* Left: Quotation summary */}
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Ringkasan Quotation</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <CaseField label="Quotation No" lock>
            <Input value={quotation?.quotationNo || "-"} readOnly />
          </CaseField>
          <CaseField label="Quotation amount" lock>
            <Input
              value={formatAccountingRupiah(quotation?.subtotal)}
              readOnly
            />
          </CaseField>
          <CaseField label="DP" lock>
            <Input
              value={formatAccountingRupiah(totalDpAmount)}
              readOnly
            />
          </CaseField>
          <CaseField label="VAT Amount" lock>
            <Input
              value={formatAccountingRupiah(quotation?.vatAmount)}
              readOnly
            />
          </CaseField>
          <CaseField label="Grand Total (After VAT)" lock>
            <Input
              value={formatAccountingRupiah(grandTotalNumber)}
              readOnly
            />
          </CaseField>
        </CardContent>
      </Card>

      {/* Right: Invoice detail */}
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Detail Invoice</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <CaseField label="Amount Receive " star>
            <div className="space-y-1">
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.amountReceive}
                onChange={(e) => handleAmountReceiveChange(e.target.value)}
              />
              {errors.amountReceive && (
                <p className="text-xs text-red-500">{errors.amountReceive}</p>
              )}
            </div>
          </CaseField>

          <CaseField label="Payment Type">
             <SearchCommandBlock
              value={form.paymentType}
              onChange={(value) => handleChange("paymentType", value)}
              options={[
                "Cash",
                "Debit",
                "Qris",
                "Credit Card",
                "Transfer",
                "Free",
              ]}
            />
          </CaseField>

          <CaseField label="Tanggal Terima">
            <Input
              type="datetime-local"
              value={form.amountReceiveDate}
              onChange={(e) =>
                handleChange("amountReceiveDate", e.target.value)
              }
            />
          </CaseField>

          <CaseField label="Amount Difference" lock>
            <Input value={formatAccountingRupiah(Math.abs(form.amountDiff))} readOnly />
          </CaseField>

          {(Number(form.amountDiff) !== 0 || form.paymentType === 'Free') && (
            <CaseField label="Alasan Amount Difference">
              <div className="space-y-1">
                <SearchCommandBlock
                  value={form.amountDiffReason}
                  placeholder="Pilih alasan..."
                  onChange={(value) => handleChange("amountDiffReason", value)}
                  options={AMOUNT_DIFF_REASON_OPTIONS.map((reason) => ({
                    label: reason,
                    value: reason,
                  }))}
                />
                {errors.amountDiffReason && (
                  <p className="text-xs text-red-500">
                    {errors.amountDiffReason}
                  </p>
                )}
              </div>
            </CaseField>
          )}

          <CaseField label="Catatan">
            <Textarea
              value={form.amountReceiveNote}
              onChange={(e) =>
                handleChange("amountReceiveNote", e.target.value)
              }
              placeholder="Catatan tambahan terkait invoice"
              rows={3}
            />
          </CaseField>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <Checkbox
                className={"ring-1 "}
                checked={form.sendInvoice}
                onCheckedChange={(checked) =>
                  handleChange("sendInvoice", Boolean(checked))
                }
              />
              <span>Kirim Invoice</span>
            </label>
            <label className="flex items-center gap-2 text-sm font-medium">
              <Checkbox
                className={"ring-1 "}
                checked={form.sendWa}
                onCheckedChange={(checked) =>
                  handleChange("sendWa", Boolean(checked))
                }
              />
              <span>Kirim WhatsApp</span>
            </label>
            <label className="flex items-center gap-2 text-sm font-medium">
              <Checkbox
                className={"ring-1 "}
                checked={form.sendEmail}
                onCheckedChange={(checked) =>
                  handleChange("sendEmail", Boolean(checked))
                }
              />
              <span>Kirim Email</span>
            </label>
            <label className="flex items-center gap-2 text-sm font-medium">
              <Checkbox
                className={"ring-1 "}
                checked={form.sendErf}
                onCheckedChange={(checked) =>
                  handleChange("sendErf", Boolean(checked))
                }
              />
              <span>Kirim ERF</span>
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderConfirmation = () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Pastikan data berikut sudah benar sebelum disimpan.
      </p>
      <div className="space-y-2 rounded-md border bg-muted/50 p-4 text-sm">
        {quotation && (
          <>
            <p>
              <strong>Quotation No:</strong> {quotation?.quotationNo || "-"}
            </p>
            <p>
              <strong>Quotation Total:</strong>{" "}
              {formatAccountingRupiah(quotation.grandTotal)}
            </p>
            <p>
              <strong>DP Total:</strong>{" "}
              {formatAccountingRupiah(totalDpAmount)}
            </p>
            <p>
              <strong>Grand Total:</strong>{" "}
              {formatAccountingRupiah(grandTotalNumber)}
            </p>
          </>
        )}
        <p>
          <strong>Amount Receive:</strong>{" "}
          {formatAccountingRupiah(form.amountReceive)}
        </p>
        <p>
          <strong>Amount Difference:</strong>{" "}
          {formatAccountingRupiah(Math.abs(form.amountDiff))}
        </p>
        {(Number(form.amountDiff || 0) !== 0 || form.paymentType === "Free") && (
          <p>
            <strong>Alasan Selisih:</strong> {form.amountDiffReason || "-"}
          </p>
        )}
        <p>
          <strong>Payment Type:</strong> {form.paymentType || "-"}
        </p>
        <p>
          <strong>Tanggal Terima:</strong> {form.amountReceiveDate || "-"}
        </p>
        {form.amountReceiveNote && (
          <p>
            <strong>Catatan:</strong> {form.amountReceiveNote}
          </p>
        )}
        <p>
          <strong>Notifikasi:</strong>{" "}
          {[
            form.sendInvoice && "Invoice",
            form.sendWa && "WA",
            form.sendEmail && "Email",
            form.sendErf && "ERF",
          ]
            .filter(Boolean)
            .join(", ") || "-"}
        </p>
      </div>
    </div>
  );

  const handleOpenChange = (nextOpen) => {
    setInvoiceDialogOpen(nextOpen);
    if (!nextOpen) {
      setStep("form");
      setErrors({});
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-full sm:max-w-[960px] max-h-[90vh] p-6 flex flex-col transition-all">
        <DialogHeader>
          <DialogTitle>
            {form.invoiceNo ? "Perbarui Invoice" : "Buat Invoice"}
          </DialogTitle>
          <DialogDescription>
            Isi informasi invoice sebelum case ditutup.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto ">
          {invoiceLoading
            ? renderLoading()
            // : !quotation
            // ? renderEmptyQuotation()
            : step === "form"
            ? renderForm()
            : renderConfirmation()}
        </div>

        {!invoiceLoading && (
          <DialogFooter className="mt-6">
            {step === "form" ? (
              <>
                <DialogClose asChild>
                  <Button variant="secondary">Batal</Button>
                </DialogClose>
                <Button onClick={handleNext}>Lanjut</Button>
              </>
            ) : (
              <>
                <Button
                  variant="secondary"
                  onClick={() => setStep("form")}
                  disabled={submitting}
                >
                  Kembali
                </Button>
                <Button onClick={handleConfirm} disabled={submitting}>
                  {submitting ? "Menyimpan..." : "Simpan Invoice"}
                </Button>
              </>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDialog;
