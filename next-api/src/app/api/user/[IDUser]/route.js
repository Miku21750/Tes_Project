import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { createAccessToken } from "@/utils/auth";

// GET - Ambil detail user berdasarkan ID
export async function GET(request, { params }) {
  const { IDUser } = await params;
  const idUser = parseInt(IDUser);

  if (isNaN(idUser)) {
    return NextResponse.json({
      success: false,
      message: "Invalid ID User"
    }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { IDUser: idUser }
  });

  if (!user) {
    return NextResponse.json({
      success: false,
      message: "Detail Data User Not Found!",
      data: null
    }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    message: "Detail Data User Information",
    data: user
  }, { status: 200 });
}

// PATCH - Update user berdasarkan ID
export async function PATCH(request, { params }) {
  const { IDUser } = await params;
  const idUser = parseInt(IDUser);

  if (isNaN(idUser)) {
    return NextResponse.json({
      success: false,
      message: "Invalid ID User"
    }, { status: 400 });
  }

  try {
    const formData = await request.formData();
    const Username = formData.get("Username"); // ⬅️ HARUS ADA
    const Name = formData.get("Name");
    const Email = formData.get("Email");
    const Phone = formData.get("Phone");
    const Password = formData.get("NewPassword");
    const ProfilePhoto = formData.get("ProfilePhoto");
    const Signature = formData.get("Signature");
    const Role = formData.get("Role")
    const ResourceId = formData.get("ResourceId")

    
    let updateData = { Name, Email, Phone, Role, ResourceId };
    updateData.Username = Username;

    if (Password) {
      updateData.Password = await bcrypt.hash(Password, 10);
    }

    const oldUser = await prisma.user.findUnique({
      where: { IDUser: idUser }
    });


    // File
    if (ProfilePhoto && typeof ProfilePhoto === "object") {
      if (oldUser?.ProfilePhoto) {
        const oldPath = path.join(process.cwd(), "public", oldUser.ProfilePhoto);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      const bytes = await ProfilePhoto.arrayBuffer();
      const buffer = Buffer.from(bytes);

      //generate name
      const ext = path.extname(ProfilePhoto.name); // ambil ekstensi asli (misal .png/.jpg)
      const uniqueName = `${crypto.randomUUID()}${ext}`; 

      const uploadPath = path.join(process.cwd(), "public/uploads/profiles", uniqueName);
      fs.writeFileSync(uploadPath, buffer);
      updateData.ProfilePhoto = `/uploads/profiles/${uniqueName}`;
    }

    /**
     * REVISION : USE BASE64 INSTEAD FOR SIGNATURE (SEE BELOW THIS COMMENT)
     */
    // if (Signature) {
    //   if(typeof Signature === "object"){
    //     const bytes = await Signature.arrayBuffer();
    //     const buffer = Buffer.from(bytes);
    //     const uploadPath = path.join(process.cwd(), "public/uploads/signatures", Signature.name);
    //     fs.writeFileSync(uploadPath, buffer);
    //     updateData.Signature = `/uploads/signatures/${Signature.name}`;;
    //   }else if (typeof Signature === "string" && Signature.startsWith("data:image")) {
    //     const base64Data = Signature.replace(/^data:image\/\w+;base64,/, "");
    //     const buffer = Buffer.from(base64Data, "base64");

    //     // buat nama unik
    //     const uniqueName = `${crypto.randomUUID()}.png`;
    //     const uploadPath = path.join(process.cwd(), "public/uploads/signatures", uniqueName);
    //     fs.writeFileSync(uploadPath, buffer);
    //     updateData.Signature = `/uploads/signatures/${uniqueName}`;

    //   }
    // }


    if (Signature && Signature.startsWith("data:image")) {
      // Base64 Save
      updateData.Signature = Signature;
    }
    


    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({
        success: false,
        message: "Minimal satu field harus dikirim untuk diupdate."
      }, { status: 400 });
    }



    const updatedUser = await prisma.user.update({
      where: { IDUser: idUser },
      data: updateData,
    });

    
    const { token: accessToken, expiresAt } = createAccessToken(updatedUser);

    return NextResponse.json({
      success: true,
      message: "Data user berhasil diperbarui",
      accessToken,
      expiresAt,
      data: updatedUser
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Gagal memperbarui data user",
      error: error.message
    }, { status: 500 });
  }
}

// DELETE - Hapus user berdasarkan ID
export async function DELETE(request, { params }) {
  const { IDUser } = params;
  const idUser = parseInt(IDUser);

  if (isNaN(idUser)) {
    return NextResponse.json({
      success: false,
      message: "Invalid ID User"
    }, { status: 400 });
  }

  try {
    const deletedUser = await prisma.user.delete({
      where: { IDUser: idUser },
    });

    return NextResponse.json({
      success: true,
      message: "User berhasil dihapus",
      data: deletedUser
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "User tidak ditemukan atau sudah dihapus",
      error: error.message
    }, { status: 404 });
  }
}
