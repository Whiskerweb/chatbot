import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Engagement RGPD | HelloClaudia",
  description:
    "Engagements d'HelloClaudia en matière de protection des données et de conformité au RGPD.",
};

export default function RgpdPage() {
  return (
    <article className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="text-3xl font-semibold tracking-tight">
        Engagement RGPD
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Dernière mise à jour : 21 mars 2026
      </p>

      <div className="mt-10 space-y-10 text-sm leading-relaxed text-muted-foreground [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mb-4 [&_h3]:text-base [&_h3]:font-medium [&_h3]:text-foreground [&_h3]:mb-2 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
        <section>
          <p className="text-base text-foreground">
            La protection des données personnelles est au cœur d&apos;HelloClaudia.
            Cette page détaille nos engagements concrets en matière de conformité
            au Règlement Général sur la Protection des Données (RGPD — Règlement
            UE 2016/679).
          </p>
        </section>

        <section>
          <h2>1. Nos engagements</h2>
          <ul>
            <li>
              <strong className="text-foreground">
                Vos données ne sont jamais vendues
              </strong>{" "}
              — nous ne monétisons pas les données personnelles de nos
              utilisateurs
            </li>
            <li>
              <strong className="text-foreground">
                Pas d&apos;entraînement IA sur vos données
              </strong>{" "}
              — les documents et conversations que vous importez ne sont jamais
              utilisés pour entraîner des modèles d&apos;intelligence
              artificielle
            </li>
            <li>
              <strong className="text-foreground">
                Minimisation des données
              </strong>{" "}
              — nous ne collectons que les données strictement nécessaires au
              fonctionnement du Service
            </li>
            <li>
              <strong className="text-foreground">Transparence</strong> — nous
              documentons clairement quelles données sont collectées, pourquoi et
              pour combien de temps
            </li>
            <li>
              <strong className="text-foreground">
                Droit à la suppression
              </strong>{" "}
              — vous pouvez supprimer votre compte et toutes vos données à tout
              moment
            </li>
          </ul>
        </section>

        <section>
          <h2>2. Mesures techniques de protection</h2>
          <h3>2.1 Chiffrement</h3>
          <ul>
            <li>
              <strong className="text-foreground">Au repos</strong> : toutes les
              données stockées sont chiffrées en AES-256
            </li>
            <li>
              <strong className="text-foreground">En transit</strong> : toutes
              les communications sont protégées par TLS 1.3
            </li>
          </ul>
          <h3>2.2 Contrôle d&apos;accès</h3>
          <ul>
            <li>Authentification sécurisée avec mots de passe hashés</li>
            <li>Isolation stricte des données entre les comptes utilisateurs</li>
            <li>Accès aux systèmes de production limité et journalisé</li>
          </ul>
          <h3>2.3 Infrastructure</h3>
          <ul>
            <li>Hébergement sur Vercel avec infrastructure sécurisée</li>
            <li>Sauvegardes régulières et chiffrées</li>
            <li>Surveillance continue des systèmes</li>
          </ul>
        </section>

        <section>
          <h2>3. Sous-traitants</h2>
          <p>
            Nous travaillons avec un nombre limité de sous-traitants, chacun
            soumis à des obligations contractuelles strictes en matière de
            protection des données :
          </p>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 pr-4 font-medium text-foreground">
                    Sous-traitant
                  </th>
                  <th className="py-3 pr-4 font-medium text-foreground">
                    Finalité
                  </th>
                  <th className="py-3 font-medium text-foreground">
                    Localisation
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr]:border-b [&_tr]:border-border/50">
                <tr>
                  <td className="py-3 pr-4">Vercel Inc.</td>
                  <td className="py-3 pr-4">Hébergement</td>
                  <td className="py-3">États-Unis</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4">OpenAI</td>
                  <td className="py-3 pr-4">Génération de réponses IA</td>
                  <td className="py-3">États-Unis</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4">Anthropic</td>
                  <td className="py-3 pr-4">Génération de réponses IA</td>
                  <td className="py-3">États-Unis</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4">Google (Vertex AI)</td>
                  <td className="py-3 pr-4">Génération de réponses IA</td>
                  <td className="py-3">États-Unis / UE</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4">
            Les transferts de données vers les États-Unis sont encadrés par des
            clauses contractuelles types (CCT) conformes à l&apos;article 46.2
            du RGPD.
          </p>
        </section>

        <section>
          <h2>4. Droits des personnes concernées</h2>
          <p>
            Conformément aux articles 15 à 22 du RGPD, vous disposez des droits
            suivants :
          </p>
          <ul>
            <li>
              <strong className="text-foreground">Accès</strong> (art. 15) —
              obtenir une copie de vos données personnelles
            </li>
            <li>
              <strong className="text-foreground">Rectification</strong> (art.
              16) — corriger des données inexactes
            </li>
            <li>
              <strong className="text-foreground">Effacement</strong> (art. 17)
              — demander la suppression de vos données
            </li>
            <li>
              <strong className="text-foreground">Limitation</strong> (art. 18)
              — restreindre le traitement dans certains cas
            </li>
            <li>
              <strong className="text-foreground">Portabilité</strong> (art. 20)
              — recevoir vos données dans un format structuré
            </li>
            <li>
              <strong className="text-foreground">Opposition</strong> (art. 21)
              — vous opposer au traitement
            </li>
          </ul>
          <p>
            <strong className="text-foreground">Délai de réponse</strong> : nous
            nous engageons à répondre à toute demande dans un délai de 30 jours.
          </p>
        </section>

        <section>
          <h2>5. En cas de violation de données</h2>
          <p>
            En cas de violation de données personnelles susceptible
            d&apos;engendrer un risque pour vos droits et libertés, nous nous
            engageons à :
          </p>
          <ul>
            <li>
              Notifier la CNIL dans un délai de 72 heures conformément à
              l&apos;article 33 du RGPD
            </li>
            <li>
              Vous informer dans les meilleurs délais si la violation est
              susceptible d&apos;engendrer un risque élevé (article 34)
            </li>
            <li>
              Prendre toutes les mesures nécessaires pour limiter l&apos;impact
              de la violation
            </li>
          </ul>
        </section>

        <section>
          <h2>6. Contact et réclamation</h2>
          <p>
            Pour toute question relative à la protection de vos données ou pour
            exercer vos droits :
          </p>
          <ul>
            <li>
              Email :{" "}
              <a
                href="mailto:contact@traaaction.com"
                className="text-foreground underline underline-offset-4 hover:text-foreground/80"
              >
                contact@traaaction.com
              </a>
            </li>
            <li>
              Adresse : Lucas RONCEY, 4 rue Saint Jacques, Brest, France
            </li>
          </ul>
          <p>
            Si vous estimez que le traitement de vos données ne respecte pas la
            réglementation, vous pouvez déposer une réclamation auprès de la
            CNIL :
          </p>
          <ul>
            <li>
              Site web :{" "}
              <a
                href="https://www.cnil.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-4 hover:text-foreground/80"
              >
                www.cnil.fr
              </a>
            </li>
            <li>
              Adresse : CNIL, 3 Place de Fontenoy, TSA 80715, 75334 Paris Cedex
              07
            </li>
          </ul>
        </section>
      </div>
    </article>
  );
}
