import { createClient } from '@/lib/supabase/server'

/**
 * Get global community stats
 */
export async function getCommunityStats() {
  const supabase = await createClient()

  const [
    profilesResult,
    eventsResult,
    projectsResult,
    eventsDataResult
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('events').select('*', { count: 'exact', head: true }),
    supabase.from('registrations').select('*', { count: 'exact', head: true }),
    supabase.from('events').select('prizes')
  ])

  if (profilesResult.error) throw profilesResult.error
  if (eventsResult.error) throw eventsResult.error
  if (projectsResult.error) throw projectsResult.error
  if (eventsDataResult.error) throw eventsDataResult.error

  const builders = profilesResult.count || 0
  const hackathons = eventsResult.count || 0
  const projects = projectsResult.count || 0

  // Calculate total prize pool (heuristic)
  let totalPrizePool = 0
  eventsDataResult.data?.forEach(event => {
    // If prizes is a number or has a total field
    if (typeof event.prizes === 'number') {
      totalPrizePool += event.prizes
    } else if (event.prizes && typeof event.prizes === 'object') {
       const p = event.prizes as any
       totalPrizePool += Number(p.total) || 0
    }
  })

  return {
    builders,
    projects,
    hackathons,
    activeHackers: builders,
    newHackers: 0,
    totalEvents: hackathons,
    newEvents: 0,
    totalPrizePool: totalPrizePool > 0 ? (totalPrizePool / 100000) : 0, // Show in Lakhs
    newPrizePool: 0,
    teamsFormed: projects,
    newTeams: 0,
    totalContributors: builders,
    newContributors: 0
  }
}

/**
 * Get global leaderboard (all-time top scorers)
 */
export async function getGlobalLeaderboard() {
  const supabase = await createClient()

  // Use the materialized view for optimized performance
  const { data, error } = await supabase
    .from('leaderboard_all_time')
    .select('*')
    .limit(50)
  
  if (error) throw error

  return data.map((user: any) => ({
    id: user.id,
    name: user.username,
    username: user.username,
    avatar: user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`,
    score: user.total_xp,
    rank: user.rank,
    rankName: user.rank_name,
    rankIcon: user.rank_icon,
    events: Math.floor(user.total_xp / 500), // Heuristic: 1 event = 500 XP
    badges: ['🏅', '🚀', '🔥'].slice(0, Math.min(3, Math.floor(user.total_xp / 1000) + 1)),
    trend: Math.random() > 0.7 ? 'up' : (Math.random() > 0.1 ? 'same' : 'down')
  }))
}

/**
 * Get recent community activities
 */
export async function getCommunityActivities() {
  const supabase = await createClient()

  const { data: registrations, error } = await supabase
    .from('registrations')
    .select(`
      id,
      created_at,
      team_name,
      event:events (title),
      user:profiles (full_name, username)
    `)
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) throw error

  return registrations.map((reg: any) => ({
    id: reg.id,
    type: 'event' as const,
    title: `${reg.user?.full_name || reg.user?.username} joined ${reg.event?.title}`,
    description: `Formed team "${reg.team_name}" for the upcoming hackathon.`,
    timestamp: new Date(reg.created_at).toLocaleDateString(),
    event: reg.event?.title,
    participants: 1
  }))
}
