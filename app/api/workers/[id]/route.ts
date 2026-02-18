import { NextRequest, NextResponse } from "next/server";
import { getWorkerById, updateWorker, incrementViews } from "@/lib/firebase/services/workers.service";
import type { UpdateWorkerDTO } from "@/lib/firebase/types";

/**
 * GET /api/workers/[id]
 * Busca um trabalhador específico por ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const workerId = params.id;
    
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
    
    // Incrementa views
    await incrementViews(workerId);
    
    return NextResponse.json({
      success: true,
      data: worker,
    });
  } catch (error) {
    console.error("Error fetching worker:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao buscar trabalhador",
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/workers/[id]
 * Atualiza um trabalhador
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const workerId = params.id;
    const body: UpdateWorkerDTO = await request.json();
    
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
    
    await updateWorker(workerId, body);
    
    const updatedWorker = await getWorkerById(workerId);
    
    return NextResponse.json({
      success: true,
      data: updatedWorker,
    });
  } catch (error) {
    console.error("Error updating worker:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao atualizar trabalhador",
      },
      { status: 500 }
    );
  }
}

