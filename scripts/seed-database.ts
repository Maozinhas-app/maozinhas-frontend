/**
 * Script para popular o banco de dados com dados de teste
 * Execute com: npx tsx scripts/seed-database.ts
 */

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAheQuAHZfVGU-77LmYe2_oGwBRiA7zq2I",
  authDomain: "maozinhas-f3b0d.firebaseapp.com",
  projectId: "maozinhas-f3b0d",
  storageBucket: "maozinhas-f3b0d.firebasestorage.app",
  messagingSenderId: "981416836491",
  appId: "1:981416836491:web:6ea6d0086cc17bad8a438e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedDatabase() {
  try {
    console.log("🌱 Iniciando seed do banco de dados...\n");

    // 1. Criar usuário de teste (seeker)
    console.log("👤 Criando usuário de teste...");
    const userData = {
      uid: "test-user-uid-123",
      email: "maria.teste@maozinhas.com",
      name: "Maria Silva Teste",
      phone: "+5511987654321",
      photoURL: "https://i.pravatar.cc/150?img=1",
      userType: "seeker",
      location: {
        cep: "01310-100",
        street: "Avenida Paulista",
        number: "1578",
        neighborhood: "Bela Vista",
        city: "São Paulo",
        state: "SP",
        coordinates: {
          latitude: -23.561414,
          longitude: -46.656081
        }
      },
      favorites: [],
      searchHistory: [
        {
          category: "casa",
          cep: "01310-100",
          timestamp: Timestamp.now()
        }
      ],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    const userRef = await addDoc(collection(db, "users"), userData);
    console.log("✅ Usuário criado com ID:", userRef.id);
    console.log("   Email:", userData.email);
    console.log("   Nome:", userData.name);
    console.log("   Cidade:", userData.location.city, "-", userData.location.state);
    console.log();

    // 2. Criar trabalhador de teste (worker)
    console.log("🔧 Criando trabalhador de teste...");
    const workerData = {
      uid: "test-worker-uid-456",
      email: "joao.pintor@maozinhas.com",
      name: "João Silva",
      companyName: "João Pinturas e Reformas",
      phone: "+5511998765432",
      photoURL: "https://i.pravatar.cc/150?img=12",
      cpfCnpj: "123.456.789-00",
      userType: "worker",
      description: "Pintor profissional com 15 anos de experiência em pintura residencial e comercial. Especializado em texturas, grafiato, epoxi e acabamentos especiais. Trabalho com materiais de primeira qualidade e ofereço garantia em todos os serviços.",
      category: "casa",
      services: ["pintor", "reformas"],
      status: "approved",
      verified: true,
      available: true,
      rating: 4.8,
      reviewCount: 127,
      location: {
        cep: "01310-200",
        street: "Rua Augusta",
        number: "2690",
        neighborhood: "Consolação",
        city: "São Paulo",
        state: "SP",
        coordinates: {
          latitude: -23.557523,
          longitude: -46.659668
        }
      },
      priceRange: {
        min: 150,
        max: 300,
        unit: "dia"
      },
      availability: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true,
        sunday: false,
        startTime: "08:00",
        endTime: "18:00"
      },
      portfolio: [
        "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=500",
        "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500",
        "https://images.unsplash.com/photo-1581858726788-75bc0f1a4e8d?w=500"
      ],
      stats: {
        views: 1523,
        contacts: 234,
        hires: 89
      },
      reviews: [
        {
          id: "review1",
          userId: userRef.id,
          userName: "Maria Silva Teste",
          rating: 5,
          comment: "Excelente profissional! Trabalho impecável e pontual. Super recomendo!",
          createdAt: Timestamp.now()
        }
      ],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    const workerRef = await addDoc(collection(db, "workers"), workerData);
    console.log("✅ Trabalhador criado com ID:", workerRef.id);
    console.log("   Email:", workerData.email);
    console.log("   Nome:", workerData.name);
    console.log("   Empresa:", workerData.companyName);
    console.log("   Categoria:", workerData.category);
    console.log("   Serviços:", workerData.services.join(", "));
    console.log("   Rating:", workerData.rating, "⭐");
    console.log("   Status:", workerData.status);
    console.log("   Cidade:", workerData.location.city, "-", workerData.location.state);
    console.log();

    // 3. Criar mais alguns trabalhadores variados
    console.log("🔧 Criando trabalhadores adicionais...\n");

    const additionalWorkers = [
      {
        uid: "test-worker-uid-789",
        email: "maria.eletricista@maozinhas.com",
        name: "Maria Santos",
        companyName: "Maria Elétrica",
        phone: "+5511987654333",
        photoURL: "https://i.pravatar.cc/150?img=5",
        userType: "worker",
        description: "Eletricista certificada com especialização em instalações residenciais e comerciais. Trabalho com segurança e qualidade garantida.",
        category: "casa",
        services: ["eletricista"],
        status: "approved",
        verified: true,
        available: true,
        rating: 4.9,
        reviewCount: 89,
        location: {
          cep: "01310-300",
          street: "Rua da Consolação",
          number: "3000",
          neighborhood: "Consolação",
          city: "São Paulo",
          state: "SP"
        },
        priceRange: {
          min: 120,
          max: 250,
          unit: "servico"
        },
        availability: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: false,
          sunday: false
        },
        stats: {
          views: 890,
          contacts: 156,
          hires: 67
        },
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        uid: "test-worker-uid-012",
        email: "carlos.encanador@maozinhas.com",
        name: "Carlos Oliveira",
        companyName: "Carlos Hidráulica 24h",
        phone: "+5511987654444",
        photoURL: "https://i.pravatar.cc/150?img=8",
        userType: "worker",
        description: "Encanador com 20 anos de experiência. Atendimento 24h para emergências. Especialista em desentupimentos e vazamentos.",
        category: "casa",
        services: ["encanador"],
        status: "approved",
        verified: true,
        available: true,
        rating: 4.7,
        reviewCount: 203,
        location: {
          cep: "04101-000",
          street: "Rua Vergueiro",
          number: "1500",
          neighborhood: "Paraíso",
          city: "São Paulo",
          state: "SP"
        },
        priceRange: {
          min: 100,
          max: 200,
          unit: "servico"
        },
        availability: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
          startTime: "00:00",
          endTime: "23:59"
        },
        stats: {
          views: 2341,
          contacts: 567,
          hires: 234
        },
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        uid: "test-worker-uid-345",
        email: "ana.limpeza@maozinhas.com",
        name: "Ana Paula",
        companyName: "Limpeza Express",
        phone: "+5511987654555",
        photoURL: "https://i.pravatar.cc/150?img=9",
        userType: "worker",
        description: "Serviços de limpeza residencial e pós-obra. Equipe treinada e produtos profissionais. Orçamento sem compromisso.",
        category: "casa",
        services: ["limpeza"],
        status: "approved",
        verified: true,
        available: true,
        rating: 5.0,
        reviewCount: 312,
        location: {
          cep: "05412-001",
          street: "Rua Fradique Coutinho",
          number: "1234",
          neighborhood: "Pinheiros",
          city: "São Paulo",
          state: "SP"
        },
        priceRange: {
          min: 180,
          max: 400,
          unit: "servico"
        },
        availability: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: false
        },
        stats: {
          views: 3421,
          contacts: 789,
          hires: 456
        },
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }
    ];

    for (const worker of additionalWorkers) {
      const ref = await addDoc(collection(db, "workers"), worker);
      console.log(`✅ ${worker.name} (${worker.services.join(", ")}) - ID: ${ref.id}`);
    }

    console.log("\n✨ Seed completo! Dados de teste criados com sucesso!");
    console.log("\n📊 Resumo:");
    console.log("   - 1 usuário (seeker)");
    console.log("   - 4 trabalhadores (workers)");
    console.log("   - Total de 5 documentos criados");
    console.log("\n🔗 Acesse as APIs:");
    console.log("   GET https://maozinhas-front.vercel.app/api/workers?nearby=true&city=São Paulo&state=SP");
    console.log("   GET https://maozinhas-front.vercel.app/api/workers?featured=true");
    console.log(`   GET https://maozinhas-front.vercel.app/api/users/${userRef.id}`);

  } catch (error) {
    console.error("❌ Erro ao criar dados de teste:", error);
    throw error;
  }
}

// Executar seed
seedDatabase()
  .then(() => {
    console.log("\n✅ Processo concluído!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Erro no processo:", error);
    process.exit(1);
  });

