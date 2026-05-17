"use client";

import { useState, useRef } from "react";
import {
  HiOutlineCheckCircle,
  HiArrowRight,
  HiOutlineIdentification,
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlineUsers,
  HiOutlineBriefcase,
  HiOutlineHome,
  HiOutlineDocumentText,
  HiOutlinePlus,
  HiOutlineTrash,
} from "react-icons/hi2";
import { submitMembership, type ChildInfo } from "@/lib/applications";
import { getToken } from "@/lib/auth";
import { mediaUrl } from "@/lib/media";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

const inputCls =
  "w-full px-4 py-2.5 border border-border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition text-sm";
const labelCls =
  "block text-xs font-bold text-primary-dark mb-1.5 uppercase tracking-wider";

const MEMBERSHIP_TYPES = ["Life", "Annual", "Honorary", "Associate"];
const GENDERS = ["Male", "Female", "Other"];
const PROPERTY_RELATIONSHIPS = [
  "Owner",
  "Spouse of Owner",
  "Child of Owner",
  "Tenant",
  "Other",
];

export default function MembershipRegistrationPage() {
  // Membership Type & Declaration
  const [membershipType, setMembershipType] = useState("Life");
  const [agreedDeclaration, setAgreedDeclaration] = useState(false);
  const [proposerName, setProposerName] = useState("");
  const [proposerMembershipNo, setProposerMembershipNo] = useState("");
  const [seconderName, setSeconderName] = useState("");
  const [seconderMembershipNo, setSeconderMembershipNo] = useState("");

  // Personal
  const [fullName, setFullName] = useState("");
  const [fullNameBn, setFullNameBn] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [spouseName, setSpouseName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [profession, setProfession] = useState("");

  // Contact
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [officePhone, setOfficePhone] = useState("");
  const [residencePhone, setResidencePhone] = useState("");

  // Children
  const [children, setChildren] = useState<ChildInfo[]>([]);

  // Professional
  const [designation, setDesignation] = useState("");
  const [organization, setOrganization] = useState("");

  // Address & Property
  const [residenceAddress, setResidenceAddress] = useState("");
  const [propertyOwner, setPropertyOwner] = useState("");
  const [propertyScheduleSummary, setPropertyScheduleSummary] = useState("");
  const [relationshipToProperty, setRelationshipToProperty] = useState("");

  // Documents
  const [photoUrl, setPhotoUrl] = useState("");
  const [nidUrl, setNidUrl] = useState("");
  const [taxReceiptUrl, setTaxReceiptUrl] = useState("");

  const photoInputRef = useRef<HTMLInputElement>(null);
  const nidInputRef = useRef<HTMLInputElement>(null);
  const taxInputRef = useRef<HTMLInputElement>(null);

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  async function uploadFile(file: File, target: "photo" | "nid" | "tax") {
    setUploadingField(target);
    try {
      const form = new FormData();
      form.append("file", file);
      const token = getToken();
      const res = await fetch(`${API_URL}/uploads`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: form,
      });
      const body = await res.json();
      if (!res.ok || !body.success) {
        throw new Error(body.message ?? "Upload failed");
      }
      const url = body.data.url as string;
      if (target === "photo") setPhotoUrl(url);
      if (target === "nid") setNidUrl(url);
      if (target === "tax") setTaxReceiptUrl(url);
    } catch (e) {
      alert(`Upload failed: ${e instanceof Error ? e.message : "unknown"}`);
    } finally {
      setUploadingField(null);
    }
  }

  function addChild() {
    setChildren((c) => [...c, { name: "", dateOfBirth: "", school: "" }]);
  }
  function removeChild(i: number) {
    setChildren((c) => c.filter((_, idx) => idx !== i));
  }
  function updateChild(i: number, key: keyof ChildInfo, value: string) {
    setChildren((c) =>
      c.map((child, idx) => (idx === i ? { ...child, [key]: value } : child))
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!agreedDeclaration) {
      setError("Please agree to the declaration and terms before submitting.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitting(true);
    try {
      const cleanChildren = children.filter((c) => c.name.trim());
      const result = await submitMembership({
        membershipType,
        agreedDeclaration,
        proposerName: proposerName.trim() || null,
        proposerMembershipNo: proposerMembershipNo.trim() || null,
        seconderName: seconderName.trim() || null,
        seconderMembershipNo: seconderMembershipNo.trim() || null,
        fullName: fullName.trim(),
        fullNameBn: fullNameBn.trim() || null,
        fatherName: fatherName.trim() || null,
        motherName: motherName.trim() || null,
        spouseName: spouseName.trim() || null,
        dateOfBirth: dateOfBirth || null,
        gender: gender || null,
        bloodGroup: bloodGroup.trim() || null,
        profession: profession.trim() || null,
        email: email.trim(),
        mobile: mobile.trim(),
        officePhone: officePhone.trim() || null,
        residencePhone: residencePhone.trim() || null,
        children: cleanChildren.length > 0 ? cleanChildren : [],
        designation: designation.trim() || null,
        organization: organization.trim() || null,
        residenceAddress: residenceAddress.trim() || null,
        propertyOwner: propertyOwner.trim() || null,
        propertyScheduleSummary: propertyScheduleSummary.trim() || null,
        relationshipToProperty: relationshipToProperty || null,
        photoUrl: photoUrl || null,
        nidUrl: nidUrl || null,
        taxReceiptUrl: taxReceiptUrl || null,
      });
      setDone(result.id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="bg-white border border-border rounded-md p-10 lg:p-14 text-center shadow-sm">
        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-amber-100 grid place-items-center">
          <HiOutlineCheckCircle className="text-4xl text-amber-700" />
        </div>
        <h2 className="text-2xl lg:text-3xl font-extrabold text-primary-dark tracking-tight mb-3">
          Application Submitted
        </h2>
        <p className="text-muted mb-2">
          Your membership application has been received.
        </p>
        <p className="text-sm text-muted">
          Reference ID:{" "}
          <span className="font-mono font-bold text-primary">{done}</span>
        </p>
        <p className="text-sm text-muted mt-6 max-w-md mx-auto">
          The society office will review your application and contact you
          within 5-7 working days at the email/phone you provided.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl lg:text-3xl font-extrabold text-primary-dark tracking-tight">
          Membership Application
        </h2>
        <p className="text-muted mt-2">
          Become a part of our community. Fill out the form below to start your
          membership journey with Kajla Society.
        </p>
      </div>

      {error && (
        <div className="mb-5 px-4 py-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        {/* ============ Section 1 — Membership Type & Declaration ============ */}
        <Section title="Membership Type & Declaration" Icon={HiOutlineIdentification}>
          <div>
            <label className={labelCls}>
              Type of Membership <span className="text-danger">*</span>
            </label>
            <select
              required
              value={membershipType}
              onChange={(e) => setMembershipType(e.target.value)}
              className={inputCls}
            >
              {MEMBERSHIP_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mt-4">
            <p className="text-sm text-foreground/85 leading-relaxed mb-3">
              I hereby declare that I wish to become a{" "}
              <strong>{membershipType}</strong> member of Kajla Society. I
              agree to abide by the constitution and rules of the society. I
              enclose the personal information and the required payment in
              favor of Kajla Society for Membership.
            </p>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedDeclaration}
                onChange={(e) => setAgreedDeclaration(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-amber-600"
              />
              <span className="text-sm font-semibold text-primary-dark">
                I agree to the above declaration and terms{" "}
                <span className="text-danger">*</span>
              </span>
            </label>
          </div>

          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4 mt-6">
            <SubHeading>Proposer Information</SubHeading>
            <SubHeading>Seconder Information</SubHeading>

            <div>
              <label className={labelCls}>Proposer Name</label>
              <input
                value={proposerName}
                onChange={(e) => setProposerName(e.target.value)}
                placeholder="Enter proposer name"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Seconder Name</label>
              <input
                value={seconderName}
                onChange={(e) => setSeconderName(e.target.value)}
                placeholder="Enter seconder name"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Proposer Membership Number</label>
              <input
                value={proposerMembershipNo}
                onChange={(e) => setProposerMembershipNo(e.target.value)}
                placeholder="Enter membership number"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Seconder Membership Number</label>
              <input
                value={seconderMembershipNo}
                onChange={(e) => setSeconderMembershipNo(e.target.value)}
                placeholder="Enter membership number"
                className={inputCls}
              />
            </div>
          </div>
        </Section>

        {/* ============ Section 2 — Personal Information ============ */}
        <Section title="Personal Information" Icon={HiOutlineUser}>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <label className={labelCls}>
                Full Name <span className="text-danger">*</span>
              </label>
              <input
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Name (Bangla)</label>
              <input
                value={fullNameBn}
                onChange={(e) => setFullNameBn(e.target.value)}
                placeholder="Enter your name in Bangla"
                lang="bn"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Father&apos;s Name</label>
              <input
                value={fatherName}
                onChange={(e) => setFatherName(e.target.value)}
                placeholder="Enter father's name"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Mother&apos;s Name</label>
              <input
                value={motherName}
                onChange={(e) => setMotherName(e.target.value)}
                placeholder="Enter mother's name"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Spouse Name</label>
              <input
                value={spouseName}
                onChange={(e) => setSpouseName(e.target.value)}
                placeholder="Enter spouse's name"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className={inputCls}
              >
                <option value="">Select Gender</option>
                {GENDERS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Blood Group</label>
              <input
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                placeholder="e.g. A+"
                className={inputCls}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelCls}>Profession</label>
              <input
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                placeholder="Enter your profession"
                className={inputCls}
              />
            </div>
          </div>
        </Section>

        {/* ============ Section 3 — Contact Information ============ */}
        <Section title="Contact Information" Icon={HiOutlineEnvelope}>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <label className={labelCls}>
                Email Address <span className="text-danger">*</span>
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>
                Mobile Number <span className="text-danger">*</span>
              </label>
              <input
                required
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter your mobile number"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Office Telephone</label>
              <input
                value={officePhone}
                onChange={(e) => setOfficePhone(e.target.value)}
                placeholder="Enter office telephone"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Residence Telephone</label>
              <input
                value={residencePhone}
                onChange={(e) => setResidencePhone(e.target.value)}
                placeholder="Enter residence telephone"
                className={inputCls}
              />
            </div>
          </div>
        </Section>

        {/* ============ Section 4 — Children Information ============ */}
        <Section title="Children Information" Icon={HiOutlineUsers}>
          {children.length === 0 ? (
            <p className="text-sm text-muted mb-3">No children added yet.</p>
          ) : (
            <div className="space-y-3 mb-4">
              {children.map((c, i) => (
                <div
                  key={i}
                  className="bg-amber-50/50 border border-amber-200 rounded-md p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                      Child {i + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeChild(i)}
                      className="text-red-600 hover:text-red-700 text-sm inline-flex items-center gap-1"
                    >
                      <HiOutlineTrash />
                      Remove
                    </button>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <div>
                      <label className={labelCls}>Name</label>
                      <input
                        value={c.name}
                        onChange={(e) => updateChild(i, "name", e.target.value)}
                        placeholder="Child's name"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Date of Birth</label>
                      <input
                        type="date"
                        value={c.dateOfBirth ?? ""}
                        onChange={(e) =>
                          updateChild(i, "dateOfBirth", e.target.value)
                        }
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>School</label>
                      <input
                        value={c.school ?? ""}
                        onChange={(e) => updateChild(i, "school", e.target.value)}
                        placeholder="School name"
                        className={inputCls}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={addChild}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-amber-300 hover:border-amber-400 hover:bg-amber-50 rounded-md text-sm font-bold text-amber-800 transition"
          >
            <HiOutlinePlus />
            Add Child
          </button>
        </Section>

        {/* ============ Section 5 — Professional Information ============ */}
        <Section title="Professional Information" Icon={HiOutlineBriefcase}>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <label className={labelCls}>Designation / Job Title</label>
              <input
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="Enter your job title"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Organization / Company</label>
              <input
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Enter your organization name"
                className={inputCls}
              />
            </div>
          </div>
        </Section>

        {/* ============ Section 6 — Address & Property ============ */}
        <Section title="Address & Property Information" Icon={HiOutlineHome}>
          <div>
            <label className={labelCls}>Residence Address</label>
            <textarea
              rows={3}
              value={residenceAddress}
              onChange={(e) => setResidenceAddress(e.target.value)}
              placeholder="Enter your complete residence address"
              className={inputCls}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4 mt-4">
            <div>
              <label className={labelCls}>Property Owner</label>
              <input
                value={propertyOwner}
                onChange={(e) => setPropertyOwner(e.target.value)}
                placeholder="Enter property owner name"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Property Schedule</label>
              <input
                value={propertyScheduleSummary}
                onChange={(e) => setPropertyScheduleSummary(e.target.value)}
                placeholder="Enter property schedule"
                className={inputCls}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelCls}>Relationship to Property</label>
              <select
                value={relationshipToProperty}
                onChange={(e) => setRelationshipToProperty(e.target.value)}
                className={inputCls}
              >
                <option value="">Select relationship to property</option>
                {PROPERTY_RELATIONSHIPS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Section>

        {/* ============ Section 7 — Required Documents ============ */}
        <Section title="Required Documents" Icon={HiOutlineDocumentText}>
          <FileUploadField
            label="Photograph PP Size (2 Copies)"
            required
            currentUrl={photoUrl}
            accept="image/*"
            hint="Image files only (JPG, PNG). Max size: 5MB."
            uploading={uploadingField === "photo"}
            onUpload={(f) => uploadFile(f, "photo")}
            onClear={() => setPhotoUrl("")}
            inputRef={photoInputRef}
          />
          <FileUploadField
            label="Photo Copy of NID Card"
            required
            currentUrl={nidUrl}
            accept="image/*,application/pdf"
            hint="Image or PDF. Images max 5MB; PDFs max 20MB."
            uploading={uploadingField === "nid"}
            onUpload={(f) => uploadFile(f, "nid")}
            onClear={() => setNidUrl("")}
            inputRef={nidInputRef}
          />
          <FileUploadField
            label="Photo Copy of Recent Holding Tax Receipt or Sale Deed / Share Documents Certificate"
            required
            currentUrl={taxReceiptUrl}
            accept="image/*,application/pdf"
            hint="Image or PDF. Images max 5MB; PDFs max 20MB."
            uploading={uploadingField === "tax"}
            onUpload={(f) => uploadFile(f, "tax")}
            onClear={() => setTaxReceiptUrl("")}
            inputRef={taxInputRef}
          />
        </Section>

        {/* Submit */}
        <div className="pt-2 flex justify-center">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-amber-400 hover:bg-amber-300 text-primary-dark font-bold rounded-md shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 uppercase tracking-wider text-sm"
          >
            {submitting ? (
              "Submitting..."
            ) : (
              <>
                Submit Application
                <HiArrowRight />
              </>
            )}
          </button>
        </div>
      </form>
    </>
  );
}

// ============================================================
// Section wrapper
// ============================================================
function Section({
  title,
  Icon,
  children,
}: {
  title: string;
  Icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white border border-border rounded-md p-5 lg:p-6 shadow-sm">
      <h3 className="flex items-center gap-2.5 text-base lg:text-lg font-bold text-primary-dark tracking-tight pb-3 mb-5 border-b border-border">
        <Icon className="text-xl text-amber-700" />
        {title}
      </h3>
      {children}
    </section>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-sm font-bold text-primary-dark uppercase tracking-wider sm:col-span-1">
      {children}
    </h4>
  );
}

// ============================================================
// File upload field
// ============================================================
function FileUploadField({
  label,
  required,
  currentUrl,
  accept,
  hint,
  uploading,
  onUpload,
  onClear,
  inputRef,
}: {
  label: string;
  required?: boolean;
  currentUrl: string;
  accept: string;
  hint: string;
  uploading: boolean;
  onUpload: (file: File) => void;
  onClear: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const previewUrl = currentUrl ? mediaUrl(currentUrl) : null;
  const isPdf = currentUrl.toLowerCase().endsWith(".pdf");

  return (
    <div className="mb-5 last:mb-0">
      <label className={labelCls}>
        {label}
        {required && <span className="text-danger ml-1">*</span>}
      </label>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onUpload(f);
          e.target.value = "";
        }}
      />
      {currentUrl ? (
        <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
          {!isPdf && previewUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt=""
              className="w-16 h-16 object-cover rounded border border-amber-300"
            />
          )}
          {isPdf && (
            <div className="w-16 h-16 grid place-items-center bg-red-100 text-red-700 rounded">
              <HiOutlineDocumentText className="text-2xl" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-primary-dark">
              File uploaded
            </div>
            <a
              href={previewUrl ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-amber-700 hover:underline truncate block"
            >
              View
            </a>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 text-xs font-semibold border border-border rounded hover:border-amber-400 transition"
            >
              Change
            </button>
            <button
              type="button"
              onClick={onClear}
              className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full text-left px-4 py-3 border-2 border-dashed border-border hover:border-amber-400 hover:bg-amber-50/40 rounded-md text-sm transition disabled:opacity-50"
        >
          {uploading ? (
            <span className="text-amber-700 font-semibold">Uploading...</span>
          ) : (
            <span className="text-muted">
              Click to choose file — no file chosen
            </span>
          )}
        </button>
      )}
      <p className="text-[11px] text-muted mt-1.5">{hint}</p>
    </div>
  );
}
