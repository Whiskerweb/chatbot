import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales | HelloClaudia",
  description:
    "Mentions légales du site helloclaudia.fr — éditeur, hébergeur, propriété intellectuelle.",
};

export default function MentionsLegalesPage() {
  return (
    <article className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="text-3xl font-semibold tracking-tight">
        Mentions légales
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Dernière mise à jour : 21 mars 2026
      </p>

      <div className="mt-10 space-y-10 text-sm leading-relaxed text-muted-foreground [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mb-4 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
        <section>
          <h2>1. Éditeur du site</h2>
          <p>
            Le site <strong className="text-foreground">helloclaudia.fr</strong>{" "}
            est édité par :
          </p>
          <ul>
            <li>
              <strong className="text-foreground">Lucas RONCEY</strong> —
              Micro-entreprise
            </li>
            <li>Adresse : 4 rue Saint Jacques, Brest, France</li>
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
          <h2>2. Directeur de la publication</h2>
          <p>Lucas RONCEY.</p>
        </section>

        <section>
          <h2>3. Hébergeur</h2>
          <ul>
            <li>
              <strong className="text-foreground">Vercel Inc.</strong>
            </li>
            <li>340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</li>
            <li>
              Site web :{" "}
              <a
                href="https://vercel.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-4 hover:text-foreground/80"
              >
                vercel.com
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2>4. Propriété intellectuelle</h2>
          <p>
            L&apos;ensemble des contenus présents sur le site helloclaudia.fr
            (textes, images, logos, code source, design) sont la propriété
            exclusive de Lucas RONCEY ou font l&apos;objet d&apos;une
            autorisation d&apos;utilisation.
          </p>
          <p>
            Toute reproduction, représentation, modification ou adaptation, en
            tout ou partie, sans autorisation écrite préalable, est strictement
            interdite.
          </p>
        </section>

        <section>
          <h2>5. Données personnelles</h2>
          <p>
            Pour en savoir plus sur la collecte et le traitement de vos données
            personnelles, consultez notre{" "}
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
          <h2>6. Cookies</h2>
          <p>
            Le site utilise des cookies strictement nécessaires au
            fonctionnement du service (authentification, préférences). Pour plus
            de détails, consultez notre{" "}
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
          <h2>7. Loi applicable</h2>
          <p>
            Les présentes mentions légales sont soumises au droit français.
            Conformément à la loi n°2004-575 du 21 juin 2004 pour la confiance
            dans l&apos;économie numérique (LCEN).
          </p>
        </section>
      </div>
    </article>
  );
}
