import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/firebase/services/users.service";
import type { CreateSeekerDTO } from "@/lib/firebase/types";

/**
 * POST /api/users
 * Cria um novo usuário
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateSeekerDTO = await request.json();
    
    // Validação básica
    if (!body.uid || !body.email || !body.name) {
      return NextResponse.json(
        {
          success: false,
          error: "UID, email e nome são obrigatórios",
        },
        { status: 400 }
      );
    }
    
    if (body.userType !== "seeker") {
      return NextResponse.json(
        {
          success: false,
          error: "Tipo de usuário inválido para esta rota",
        },
        { status: 400 }
      );
    }
    
    const user = await createUser(body);
    
    return NextResponse.json(
      {
        success: true,
        data: user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao criar usuário",
      },
      { status: 500 }
    );
  }
}

