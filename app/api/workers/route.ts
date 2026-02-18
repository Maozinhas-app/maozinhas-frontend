import { NextRequest, NextResponse } from "next/server";
import { searchWorkers, getNearbyWorkers, getFeaturedWorkers, createWorker } from "@/lib/firebase/services/workers.service";
import type { WorkerSearchFilters, ServiceCategory } from "@/lib/firebase/types";

/**
 * GET /api/workers
 * Busca trabalhadores com filtros
 * 
 * Query params:
 * - category: ServiceCategory
 * - city: string
 * - state: string
 * - minRating: number
 * - availableOnly: boolean
 * - verifiedOnly: boolean
 * - page: number
 * - pageSize: number
 * - nearby: boolean (para buscar próximos)
 * - featured: boolean (para buscar em destaque)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Busca trabalhadores em destaque
    if (searchParams.get("featured") === "true") {
      const limitCount = parseInt(searchParams.get("limit") || "6");
      const workers = await getFeaturedWorkers(limitCount);
      
      return NextResponse.json({
        success: true,
        data: workers,
      });
    }
    
    // Busca trabalhadores próximos
    if (searchParams.get("nearby") === "true") {
      const city = searchParams.get("city");
      const state = searchParams.get("state");
      const category = searchParams.get("category") || undefined;
      const limitCount = parseInt(searchParams.get("limit") || "10");
      
      if (!city || !state) {
        return NextResponse.json(
          {
            success: false,
            error: "Cidade e estado são obrigatórios para busca próxima",
          },
          { status: 400 }
        );
      }
      
      const workers = await getNearbyWorkers(city, state, category, limitCount);
      
      return NextResponse.json({
        success: true,
        data: workers,
      });
    }
    
    // Busca com filtros
    const filters: WorkerSearchFilters = {};
    
    if (searchParams.get("category")) {
      filters.category = searchParams.get("category") as any;
    }
    
    if (searchParams.get("city")) {
      filters.city = searchParams.get("city")!;
    }
    
    if (searchParams.get("state")) {
      filters.state = searchParams.get("state")!;
    }
    
    if (searchParams.get("minRating")) {
      filters.minRating = parseFloat(searchParams.get("minRating")!);
    }
    
    if (searchParams.get("availableOnly") === "true") {
      filters.availableOnly = true;
    }
    
    if (searchParams.get("verifiedOnly") === "true") {
      filters.verifiedOnly = true;
    }
    
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    
    const result = await searchWorkers(filters, page, pageSize);
    
    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Error fetching workers:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao buscar trabalhadores",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/workers
 * Registra um novo prestador de serviços (self-registration)
 *
 * Body:
 * - name: string
 * - companyName?: string
 * - phone?: string
 * - email: string
 * - category: ServiceCategory
 * - description: string
 * - location?: Location
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, email, category, description, companyName, phone, location } = body;

    if (!name || !email || !category || !description) {
      return NextResponse.json(
        { success: false, error: "name, email, category e description são obrigatórios" },
        { status: 400 }
      );
    }

    // Generate a temporary uid — replaced by real UID once auth is integrated
    const uid = `self-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const worker = await createWorker({
      uid,
      email,
      name,
      companyName,
      phone,
      userType: "worker",
      description,
      category: category as ServiceCategory,
      services: [],   // Filled in later by admin review
      location,
    });

    return NextResponse.json({ success: true, data: worker }, { status: 201 });
  } catch (error) {
    console.error("Error creating worker:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao registrar prestador" },
      { status: 500 }
    );
  }
}

