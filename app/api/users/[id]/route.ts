import { NextRequest, NextResponse } from "next/server";
import { getUserById, updateUser } from "@/lib/firebase/services/users.service";
import type { UpdateUserDTO } from "@/lib/firebase/types";

/**
 * GET /api/users/[id]
 * Busca um usuário específico por ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    
    const user = await getUserById(userId);
    
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Usuário não encontrado",
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao buscar usuário",
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/users/[id]
 * Atualiza um usuário
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const body: UpdateUserDTO = await request.json();
    
    // Validação básica
    if (Object.keys(body).length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Nenhum dado para atualizar",
        },
        { status: 400 }
      );
    }
    
    await updateUser(userId, body);
    
    const updatedUser = await getUserById(userId);
    
    return NextResponse.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao atualizar usuário",
      },
      { status: 500 }
    );
  }
}

