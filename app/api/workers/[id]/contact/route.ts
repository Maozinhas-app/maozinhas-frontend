import { NextRequest, NextResponse } from "next/server";
import { incrementContacts, getWorkerById } from "@/lib/firebase/services/workers.service";

/**
 * POST /api/workers/[id]/contact
 * Incrementa o contador de contatos de um trabalhador
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const workerId = params.id;
    
    // Verifica se o trabalhador existe
    const worker = await getWorkerById(workerId);
    
    if (!worker) {
      return NextResponse.json(
        {
          success: false,
          error: "Trabalhador não encontrado",
        },
        { status: 404 }
      );
    }
    
    await incrementContacts(workerId);
    
    return NextResponse.json({
      success: true,
      message: "Contato registrado com sucesso",
    });
  } catch (error) {
    console.error("Error incrementing contacts:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao registrar contato",
      },
      { status: 500 }
    );
  }
}

