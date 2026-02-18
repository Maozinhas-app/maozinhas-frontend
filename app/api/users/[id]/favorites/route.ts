import { NextRequest, NextResponse } from "next/server";
import {
  getUserFavorites,
  addToFavorites,
  removeFromFavorites,
} from "@/lib/firebase/services/users.service";

/**
 * GET /api/users/[id]/favorites
 * Busca os favoritos de um usuário
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    
    const favorites = await getUserFavorites(userId);
    
    return NextResponse.json({
      success: true,
      data: favorites,
    });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao buscar favoritos",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/users/[id]/favorites
 * Adiciona um trabalhador aos favoritos
 * 
 * Body: { workerId: string }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const body = await request.json();
    
    if (!body.workerId) {
      return NextResponse.json(
        {
          success: false,
          error: "workerId é obrigatório",
        },
        { status: 400 }
      );
    }
    
    await addToFavorites(userId, body.workerId);
    
    return NextResponse.json({
      success: true,
      message: "Adicionado aos favoritos",
    });
  } catch (error) {
    console.error("Error adding to favorites:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao adicionar aos favoritos",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/users/[id]/favorites
 * Remove um trabalhador dos favoritos
 * 
 * Body: { workerId: string }
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const body = await request.json();
    
    if (!body.workerId) {
      return NextResponse.json(
        {
          success: false,
          error: "workerId é obrigatório",
        },
        { status: 400 }
      );
    }
    
    await removeFromFavorites(userId, body.workerId);
    
    return NextResponse.json({
      success: true,
      message: "Removido dos favoritos",
    });
  } catch (error) {
    console.error("Error removing from favorites:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao remover dos favoritos",
      },
      { status: 500 }
    );
  }
}

