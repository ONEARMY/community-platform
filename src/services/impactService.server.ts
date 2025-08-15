import type { SupabaseClient } from '@supabase/supabase-js'
import type { IImpactDataField, IUserImpact } from 'oa-shared'

export class ImpactServiceServer {
  constructor(private client: SupabaseClient) {}

  async update(profileId: number, year: number, fields: IImpactDataField[]) {
    const existingImpact = await this.client
      .from('profiles')
      .select('id,impact')
      .eq('id', profileId)
      .single()

    let impact: IUserImpact = {}

    if (existingImpact.data?.impact) {
      const rawImpact = existingImpact.data.impact
      impact = typeof rawImpact === 'string' ? JSON.parse(rawImpact) : rawImpact
    }

    impact[year] = fields

    return await this.client
      .from('profiles')
      .update({
        impact: JSON.stringify(impact),
      })
      .eq('id', profileId)
      .select('impact')
      .single()
  }
}
