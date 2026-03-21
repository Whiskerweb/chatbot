import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité | HelloClaudia",
  description:
    "Politique de confidentialité d'HelloClaudia — collecte, traitement et protection de vos données personnelles.",
};

export default function ConfidentialitePage() {
  return (
    <article className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="text-3xl font-semibold tracking-tight">
        Politique de confidentialité
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Dernière mise à jour : 21 mars 2026
      </p>

      <div className="mt-10 space-y-10 text-sm leading-relaxed text-muted-foreground [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mb-4 [&_h3]:text-base [&_h3]:font-medium [&_h3]:text-foreground [&_h3]:mb-2 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
        <section>
          <h2>1. Responsable du traitement</h2>
          <p>
            Le responsable du traitement des données personnelles est :
          </p>
          <ul>
            <li>
              <strong className="text-foreground">Lucas RONCEY</strong> —
              Micro-entreprise
            </li>
            <li>4 rue Saint Jacques, Brest, France</li>
            <li>
              Email :{" "}
              <a
                href="mailto:contact@traaaction.com"
                className="text-foreground underline underline-offset-4 hover:text-foreground/80"
              >
                contact@traaaction.com
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2>2. Données collectées</h2>
          <h3>2.1 Données de compte</h3>
          <p>
            Lors de l&apos;inscription : nom, adresse email, mot de passe
            (hashé). En cas de souscription à un plan payant : informations de
            facturation traitées par notre prestataire de paiement.
          </p>
          <h3>2.2 Données d&apos;utilisation</h3>
          <ul>
            <li>
              Conversations entre les utilisateurs finaux et les chatbots créés
              par l&apos;Utilisateur
            </li>
            <li>
              Documents uploadés par l&apos;Utilisateur (PDF, DOCX, TXT, etc.)
              pour alimenter la base de connaissances
            </li>
            <li>
              URLs de sites web crawlés pour l&apos;indexation
            </li>
            <li>
              Configurations des agents (instructions, paramètres)
            </li>
            <li>
              Leads capturés via les formulaires intégrés au widget
            </li>
          </ul>
          <h3>2.3 Données techniques</h3>
          <p>
            Adresse IP, type de navigateur, pages visitées, horodatage des
            requêtes. Ces données sont collectées automatiquement à des fins de
            sécurité et d&apos;amélioration du Service.
          </p>
        </section>

        <section>
          <h2>3. Finalités du traitement</h2>
          <ul>
            <li>
              <strong className="text-foreground">Fourniture du Service</strong>{" "}
              : création de compte, configuration des chatbots, génération de
              réponses IA, analytics
            </li>
            <li>
              <strong className="text-foreground">Facturation</strong> : gestion
              des abonnements et des paiements
            </li>
            <li>
              <strong className="text-foreground">Amélioration du Service</strong>{" "}
              : analyse d&apos;usage agrégée et anonymisée
            </li>
            <li>
              <strong className="text-foreground">Communication</strong> : emails
              transactionnels (confirmation d&apos;inscription, notifications de
              compte) et, avec consentement, emails marketing
            </li>
            <li>
              <strong className="text-foreground">Sécurité</strong> : détection de
              fraude, protection contre les accès non autorisés
            </li>
          </ul>
        </section>

        <section>
          <h2>4. Base légale</h2>
          <ul>
            <li>
              <strong className="text-foreground">Exécution du contrat</strong>{" "}
              (article 6.1.b RGPD) : pour la fourniture du Service et la
              gestion du compte
            </li>
            <li>
              <strong className="text-foreground">Consentement</strong> (article
              6.1.a RGPD) : pour les communications marketing et les cookies non
              essentiels
            </li>
            <li>
              <strong className="text-foreground">Intérêt légitime</strong>{" "}
              (article 6.1.f RGPD) : pour la sécurité du Service et
              l&apos;amélioration du produit
            </li>
            <li>
              <strong className="text-foreground">Obligation légale</strong>{" "}
              (article 6.1.c RGPD) : pour la conservation des données de
              facturation
            </li>
          </ul>
        </section>

        <section>
          <h2>5. Durée de conservation</h2>
          <ul>
            <li>
              <strong className="text-foreground">Données de compte</strong> :
              conservées pendant toute la durée d&apos;utilisation du Service,
              puis supprimées dans un délai de 30 jours après la suppression du
              compte
            </li>
            <li>
              <strong className="text-foreground">Conversations</strong> :
              conservées selon le plan de l&apos;Utilisateur (7 jours à 1 an),
              puis supprimées automatiquement
            </li>
            <li>
              <strong className="text-foreground">Documents uploadés</strong> :
              supprimés dans un délai de 30 jours après la suppression du compte
              ou la suppression manuelle par l&apos;Utilisateur
            </li>
            <li>
              <strong className="text-foreground">Données de facturation</strong>{" "}
              : conservées 10 ans conformément aux obligations comptables
              françaises
            </li>
            <li>
              <strong className="text-foreground">Logs techniques</strong> :
              conservés 12 mois maximum
            </li>
          </ul>
        </section>

        <section>
          <h2>6. Destinataires des données</h2>
          <p>Vos données peuvent être partagées avec :</p>
          <ul>
            <li>
              <strong className="text-foreground">Vercel Inc.</strong> —
              hébergement de l&apos;application (États-Unis)
            </li>
            <li>
              <strong className="text-foreground">
                Fournisseurs d&apos;IA
              </strong>{" "}
              (OpenAI, Anthropic, Google) — traitement des requêtes IA. Les
              messages envoyés aux modèles ne contiennent pas de données
              d&apos;identification de l&apos;Utilisateur
            </li>
            <li>
              <strong className="text-foreground">
                Prestataire de paiement
              </strong>{" "}
              — traitement sécurisé des transactions bancaires
            </li>
          </ul>
          <p>
            Aucune donnée personnelle n&apos;est vendue à des tiers.
          </p>
        </section>

        <section>
          <h2>7. Transferts hors Union Européenne</h2>
          <p>
            Certains de nos sous-traitants sont situés aux États-Unis (Vercel,
            fournisseurs d&apos;IA). Ces transferts sont encadrés par des
            clauses contractuelles types (CCT) approuvées par la Commission
            européenne, conformément à l&apos;article 46.2 du RGPD.
          </p>
        </section>

        <section>
          <h2>8. Vos droits</h2>
          <p>
            Conformément au RGPD, vous disposez des droits suivants :
          </p>
          <ul>
            <li>
              <strong className="text-foreground">Droit d&apos;accès</strong> :
              obtenir la confirmation du traitement de vos données et en obtenir
              une copie
            </li>
            <li>
              <strong className="text-foreground">Droit de rectification</strong>{" "}
              : corriger des données inexactes ou incomplètes
            </li>
            <li>
              <strong className="text-foreground">Droit à l&apos;effacement</strong>{" "}
              : demander la suppression de vos données
            </li>
            <li>
              <strong className="text-foreground">Droit à la portabilité</strong>{" "}
              : recevoir vos données dans un format structuré et couramment
              utilisé
            </li>
            <li>
              <strong className="text-foreground">Droit d&apos;opposition</strong>{" "}
              : vous opposer au traitement de vos données pour des motifs
              légitimes
            </li>
            <li>
              <strong className="text-foreground">
                Droit à la limitation
              </strong>{" "}
              : demander la limitation du traitement dans certains cas
            </li>
          </ul>
          <p>
            Pour exercer ces droits, contactez-nous à{" "}
            <a
              href="mailto:contact@traaaction.com"
              className="text-foreground underline underline-offset-4 hover:text-foreground/80"
            >
              contact@traaaction.com
            </a>
            . Nous répondrons dans un délai de 30 jours.
          </p>
          <p>
            Vous pouvez également déposer une réclamation auprès de la CNIL
            (Commission Nationale de l&apos;Informatique et des Libertés) :{" "}
            <a
              href="https://www.cnil.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline underline-offset-4 hover:text-foreground/80"
            >
              www.cnil.fr
            </a>
          </p>
        </section>

        <section>
          <h2>9. Cookies</h2>
          <h3>9.1 Cookies essentiels</h3>
          <p>
            Le site utilise des cookies strictement nécessaires au
            fonctionnement du Service : authentification, préférences de session,
            sécurité. Ces cookies ne nécessitent pas votre consentement.
          </p>
          <h3>9.2 Cookies analytiques</h3>
          <p>
            Avec votre consentement, nous pouvons utiliser des cookies
            analytiques pour comprendre l&apos;utilisation du site et améliorer
            le Service. Vous pouvez retirer votre consentement à tout moment.
          </p>
        </section>

        <section>
          <h2>10. Sécurité</h2>
          <p>
            Nous mettons en œuvre des mesures techniques et organisationnelles
            appropriées pour protéger vos données :
          </p>
          <ul>
            <li>Chiffrement AES-256 des données au repos</li>
            <li>Chiffrement TLS 1.3 des données en transit</li>
            <li>Contrôle d&apos;accès strict aux systèmes</li>
            <li>Surveillance et journalisation des accès</li>
          </ul>
        </section>

        <section>
          <h2>11. Modification de cette politique</h2>
          <p>
            Nous nous réservons le droit de modifier cette politique à tout
            moment. En cas de modification substantielle, nous vous en
            informerons par email. La date de dernière mise à jour est indiquée
            en haut de cette page.
          </p>
        </section>

        <section>
          <h2>12. Contact</h2>
          <p>
            Pour toute question relative à cette politique de confidentialité :{" "}
            <a
              href="mailto:contact@traaaction.com"
              className="text-foreground underline underline-offset-4 hover:text-foreground/80"
            >
              contact@traaaction.com
            </a>
          </p>
        </section>
      </div>
    </article>
  );
}
