import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation | HelloClaudia",
  description:
    "Conditions Générales d'Utilisation de la plateforme HelloClaudia — chatbot IA pour les entreprises.",
};

export default function CguPage() {
  return (
    <article className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="text-3xl font-semibold tracking-tight">
        Conditions Générales d&apos;Utilisation
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Dernière mise à jour : 21 mars 2026
      </p>

      <div className="mt-10 space-y-10 text-sm leading-relaxed text-muted-foreground [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mb-4 [&_h3]:text-base [&_h3]:font-medium [&_h3]:text-foreground [&_h3]:mb-2 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1">
        <section>
          <h2>Article 1 — Objet</h2>
          <p>
            Les présentes Conditions Générales d&apos;Utilisation (ci-après
            &quot;CGU&quot;) régissent l&apos;accès et l&apos;utilisation de la
            plateforme HelloClaudia, accessible à l&apos;adresse
            helloclaudia.fr (ci-après &quot;le Service&quot;), éditée par Lucas
            RONCEY, micro-entreprise, 4 rue Saint Jacques, Brest, France.
          </p>
          <p>
            En créant un compte ou en utilisant le Service, l&apos;Utilisateur
            accepte sans réserve les présentes CGU.
          </p>
        </section>

        <section>
          <h2>Article 2 — Description du Service</h2>
          <p>
            HelloClaudia est une plateforme SaaS (Software as a Service)
            permettant aux entreprises de créer, configurer et déployer des
            chatbots alimentés par l&apos;intelligence artificielle.
          </p>
          <p>Le Service comprend notamment :</p>
          <ul>
            <li>
              La création et la configuration d&apos;agents IA (chatbots)
            </li>
            <li>
              L&apos;import de sources de données (fichiers PDF, DOCX, TXT,
              Markdown, CSV, crawling de sites web)
            </li>
            <li>
              Un widget JavaScript intégrable sur tout site web
            </li>
            <li>
              Une API REST pour l&apos;intégration programmatique
            </li>
            <li>
              Un tableau de bord avec analytics et gestion des conversations
            </li>
            <li>
              Un système de live chat pour l&apos;escalade vers un opérateur
              humain
            </li>
            <li>La capture de leads via formulaire intégré</li>
          </ul>
        </section>

        <section>
          <h2>Article 3 — Inscription et compte</h2>
          <h3>3.1 Création de compte</h3>
          <p>
            L&apos;accès au Service nécessite la création d&apos;un compte.
            L&apos;Utilisateur s&apos;engage à fournir des informations exactes
            et à les maintenir à jour.
          </p>
          <h3>3.2 Sécurité du compte</h3>
          <p>
            L&apos;Utilisateur est responsable de la confidentialité de ses
            identifiants de connexion. Toute activité réalisée depuis son compte
            est réputée effectuée par lui. En cas d&apos;utilisation non
            autorisée, l&apos;Utilisateur doit en informer HelloClaudia sans
            délai à{" "}
            <a
              href="mailto:contact@traaaction.com"
              className="text-foreground underline underline-offset-4 hover:text-foreground/80"
            >
              contact@traaaction.com
            </a>
            .
          </p>
          <h3>3.3 Âge minimum</h3>
          <p>
            Le Service est destiné aux professionnels. L&apos;Utilisateur
            déclare être âgé d&apos;au moins 18 ans et avoir la capacité
            juridique de conclure un contrat.
          </p>
        </section>

        <section>
          <h2>Article 4 — Plans et crédits</h2>
          <h3>4.1 Plans tarifaires</h3>
          <p>
            Le Service propose plusieurs plans tarifaires (Free, Starter, Pro,
            Growth), dont les caractéristiques et tarifs sont détaillés sur la
            page{" "}
            <a
              href="/tarifs"
              className="text-foreground underline underline-offset-4 hover:text-foreground/80"
            >
              Tarifs
            </a>
            .
          </p>
          <h3>4.2 Système de crédits</h3>
          <p>
            L&apos;utilisation du Service repose sur un système de crédits.
            Chaque action (message IA, indexation de documents) consomme un
            nombre de crédits variable. La consommation est consultable en temps
            réel dans le tableau de bord.
          </p>
          <h3>4.3 Facturation</h3>
          <p>
            Les plans payants sont facturés mensuellement. Le paiement est dû au
            début de chaque période de facturation. L&apos;Utilisateur peut
            changer de plan à tout moment ; le montant est calculé au prorata.
          </p>
          <h3>4.4 BYOK (Bring Your Own Keys)</h3>
          <p>
            Les plans éligibles permettent à l&apos;Utilisateur d&apos;utiliser
            ses propres clés API de fournisseurs d&apos;IA (OpenAI, Anthropic,
            Google). Dans ce cas, les messages générés ne consomment pas de
            crédits HelloClaudia. L&apos;Utilisateur est seul responsable des
            coûts et conditions d&apos;utilisation liés à ses propres clés API.
          </p>
        </section>

        <section>
          <h2>Article 5 — Obligations de l&apos;Utilisateur</h2>
          <p>L&apos;Utilisateur s&apos;engage à :</p>
          <ul>
            <li>
              Utiliser le Service conformément aux lois et règlements en vigueur
            </li>
            <li>
              Ne pas uploader de contenus illicites, diffamatoires, violents ou
              portant atteinte aux droits de tiers
            </li>
            <li>
              Ne pas tenter de contourner les mesures de sécurité ou les
              limitations du Service
            </li>
            <li>
              Ne pas utiliser le Service pour du spam, du phishing ou toute
              activité frauduleuse
            </li>
            <li>
              S&apos;assurer que les documents uploadés ne contiennent pas de
              données personnelles sensibles sans base légale appropriée
            </li>
            <li>
              Respecter les droits de propriété intellectuelle des contenus
              qu&apos;il importe dans le Service
            </li>
          </ul>
        </section>

        <section>
          <h2>Article 6 — Propriété intellectuelle</h2>
          <h3>6.1 Propriété d&apos;HelloClaudia</h3>
          <p>
            La plateforme HelloClaudia, son code source, son design, sa marque
            et ses contenus sont la propriété exclusive de Lucas RONCEY. Aucun
            droit de propriété intellectuelle n&apos;est transféré à
            l&apos;Utilisateur.
          </p>
          <h3>6.2 Contenus de l&apos;Utilisateur</h3>
          <p>
            L&apos;Utilisateur conserve la propriété de tous les contenus
            qu&apos;il importe dans le Service (documents, textes, images).
            L&apos;Utilisateur accorde à HelloClaudia une licence limitée,
            non-exclusive, pour le traitement de ces contenus dans le cadre
            exclusif de la fourniture du Service.
          </p>
          <p>
            Les contenus de l&apos;Utilisateur ne sont jamais utilisés pour
            entraîner des modèles d&apos;intelligence artificielle.
          </p>
        </section>

        <section>
          <h2>Article 7 — Disponibilité et maintenance</h2>
          <p>
            HelloClaudia s&apos;efforce d&apos;assurer la disponibilité du
            Service 24h/24, 7j/7. Toutefois, le Service peut être
            temporairement interrompu pour maintenance, mise à jour ou en cas de
            force majeure, sans que cela ne donne droit à une indemnisation.
          </p>
        </section>

        <section>
          <h2>Article 8 — Responsabilité</h2>
          <h3>8.1 Limitation de responsabilité</h3>
          <p>
            Le Service est fourni &quot;en l&apos;état&quot;. HelloClaudia ne
            garantit pas que les réponses générées par l&apos;IA soient exactes,
            complètes ou adaptées à un usage particulier. L&apos;Utilisateur est
            seul responsable de l&apos;utilisation qu&apos;il fait des réponses
            générées.
          </p>
          <h3>8.2 Exclusions</h3>
          <p>
            HelloClaudia ne saurait être tenu responsable des dommages
            indirects, pertes de données, pertes de chiffre d&apos;affaires ou
            préjudices consécutifs résultant de l&apos;utilisation ou de
            l&apos;impossibilité d&apos;utiliser le Service.
          </p>
          <h3>8.3 Plafond</h3>
          <p>
            En tout état de cause, la responsabilité totale d&apos;HelloClaudia
            est limitée au montant des sommes effectivement versées par
            l&apos;Utilisateur au cours des 12 derniers mois précédant le fait
            générateur.
          </p>
        </section>

        <section>
          <h2>Article 9 — Résiliation</h2>
          <h3>9.1 Par l&apos;Utilisateur</h3>
          <p>
            L&apos;Utilisateur peut résilier son compte à tout moment depuis les
            paramètres de son tableau de bord. La résiliation prend effet à la
            fin de la période de facturation en cours.
          </p>
          <h3>9.2 Par HelloClaudia</h3>
          <p>
            HelloClaudia se réserve le droit de suspendre ou résilier un compte
            en cas de violation des présentes CGU, après notification par email.
            En cas de violation grave, la suspension peut être immédiate.
          </p>
          <h3>9.3 Effets de la résiliation</h3>
          <p>
            À la résiliation, l&apos;Utilisateur perd l&apos;accès au Service.
            Les données de l&apos;Utilisateur sont supprimées conformément à
            notre{" "}
            <a
              href="/legal/confidentialite"
              className="text-foreground underline underline-offset-4 hover:text-foreground/80"
            >
              Politique de confidentialité
            </a>
            .
          </p>
        </section>

        <section>
          <h2>Article 10 — Modification des CGU</h2>
          <p>
            HelloClaudia se réserve le droit de modifier les présentes CGU à
            tout moment. Les modifications entrent en vigueur dès leur
            publication sur le site. L&apos;Utilisateur sera notifié par email
            en cas de modification substantielle. La poursuite de
            l&apos;utilisation du Service après modification vaut acceptation des
            nouvelles CGU.
          </p>
        </section>

        <section>
          <h2>Article 11 — Droit applicable et juridiction</h2>
          <p>
            Les présentes CGU sont régies par le droit français. En cas de
            litige, les parties s&apos;efforceront de trouver une solution
            amiable. À défaut, le litige sera porté devant les tribunaux
            compétents de Brest, France.
          </p>
        </section>

        <section>
          <h2>Article 12 — Contact</h2>
          <p>
            Pour toute question relative aux présentes CGU, vous pouvez nous
            contacter à :{" "}
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
