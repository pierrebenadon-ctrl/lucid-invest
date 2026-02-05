
import { dbService } from '../services/dbService';

export const config = { runtime: 'edge' };

/**
 * Endpoint Webhook Stripe pour Vercel.
 * Gère l'activation des abonnements Alpha et Beta après paiement.
 */
export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const body = await req.text();
  
  try {
    const event = JSON.parse(body);

    // Événement déclenché après un paiement Stripe Checkout réussi
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userEmail = session.customer_details?.email;
      
      // Récupération des choix de l'utilisateur passés en métadonnées
      const planType = session.metadata?.planType; // 'ALPHA', 'ALPHA_JUNIOR', 'MINI_BETA'
      const hasCrypto = session.metadata?.hasCrypto === 'true';

      console.log(`[Stripe Success] ${userEmail} a souscrit au plan ${planType} (Crypto: ${hasCrypto})`);

      /**
       * Note : Dans cet environnement de démonstration, nous logguons simplement l'événement.
       * En production, vous mettriez ici à jour votre base de données persistante (Postgres, MongoDB, Vercel KV).
       */
    }

    // Gestion de la résiliation
    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;
      console.log(`[Stripe Cancel] Désabonnement détecté : ${subscription.id}`);
    }

    return new Response(JSON.stringify({ received: true }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    console.error(`[Webhook Error] ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
}
