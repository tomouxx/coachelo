import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/admin/login" }
});

// Protège toutes les pages /admin/** SAUF /admin/login
// Les API admin sont elles-mêmes sécurisées via getServerSession()
export const config = {
  matcher: ["/admin/((?!login).*)"]
};
