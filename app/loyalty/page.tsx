import { MainNav } from "@/components/navigation/main-nav"
import { LoyaltyContent } from "./loyalty-content"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export default async function LoyaltyPage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log("Loyalty page - User:", user ? `Authenticated (${user.email})` : "Not authenticated")

  let userProfile = null
  let transactions = []
  let rewards = []
  let promoCodes = []
  let userData = null

  if (user) {
    userData = {
      id: user.id,
      email: user.email,
    }

    const { data: existingProfile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    console.log(
      "[v0] Existing profile:",
      existingProfile ? "Found" : "Not found",
      profileError ? `Error: ${profileError.message}` : "",
    )

    if (!existingProfile) {
      // Create profile for new user
      const { data: newProfile, error: createError } = await supabase
        .from("user_profiles")
        .insert({
          id: user.id,
          full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Utilisateur",
          phone: user.user_metadata?.phone || null,
          loyalty_points: 0,
          total_orders: 0,
        })
        .select()
        .single()

      console.log(
        "[v0] Created new profile:",
        newProfile ? "Success" : "Failed",
        createError ? `Error: ${createError.message}` : "",
      )
      userProfile = newProfile
    } else {
      userProfile = existingProfile
    }

    const { data: transactionsData, error: transactionsError } = await supabase
      .from("loyalty_transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10)

    console.log(
      "[v0] Transactions:",
      transactionsData?.length || 0,
      transactionsError ? `Error: ${transactionsError.message}` : "",
    )
    transactions = transactionsData || []
  }

  const [rewardsResult, promoCodesResult] = await Promise.all([
    supabase.from("loyalty_rewards").select("*").eq("is_active", true).order("points_required", { ascending: true }),
    supabase.from("promo_codes").select("*").eq("is_active", true),
  ])

  console.log("[v0] Rewards:", rewardsResult.data?.length || 0, "Promo codes:", promoCodesResult.data?.length || 0)

  rewards = rewardsResult.data || []
  promoCodes = promoCodesResult.data || []

  console.log(
    "[v0] Passing to LoyaltyContent - User:",
    !!userData,
    "Profile:",
    !!userProfile,
    "Transactions:",
    transactions.length,
  )

  return (
    <div className="min-h-screen">
      <MainNav />
      <LoyaltyContent
        user={userData}
        userProfile={userProfile}
        transactions={transactions}
        rewards={rewards}
        promoCodes={promoCodes}
      />
    </div>
  )
}
