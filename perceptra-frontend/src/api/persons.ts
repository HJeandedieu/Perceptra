import { apiGet, apiPost, apiPut, apiDelete } from './client'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Person {
  id:           string
  name:         string
  role:         string
  registeredAt: string
  updatedAt:    string
}

// Full person returned by GET /api/persons (includes face for AI engine)
export interface PersonWithFace extends Person {
  face_image_b64: string
}

export interface CreatePersonRequest {
  name:         string
  role:         string
  faceImageB64: string
}

export interface UpdatePersonRequest {
  name?:         string
  role?:         string
  faceImageB64?: string
}

// ---------------------------------------------------------------------------
// API calls
// ---------------------------------------------------------------------------

/**
 * GET /api/persons
 * Returns all registered persons.
 * Public — no auth required (also used by AI engine).
 */
export async function getPersons(): Promise<PersonWithFace[]> {
  return apiGet<PersonWithFace[]>('/api/persons')
}

/**
 * GET /api/persons/:id
 * Returns a single person by ID.
 */
export async function getPersonById(id: string): Promise<{ person: Person }> {
  return apiGet<{ person: Person }>(`/api/persons/${id}`)
}

/**
 * POST /api/persons
 * Register a new person with their face image.
 * Requires operator or admin JWT.
 */
export async function createPerson(
  data: CreatePersonRequest,
): Promise<{ message: string; person: Person }> {
  return apiPost<{ message: string; person: Person }>('/api/persons', data)
}

/**
 * PUT /api/persons/:id
 * Update a person's name, role, or face image.
 * Requires operator or admin JWT.
 */
export async function updatePerson(
  id: string,
  data: UpdatePersonRequest,
): Promise<{ message: string; person: Person }> {
  return apiPut<{ message: string; person: Person }>(`/api/persons/${id}`, data)
}

/**
 * DELETE /api/persons/:id
 * Remove a registered person.
 * Requires ADMIN role JWT.
 */
export async function deletePerson(
  id: string,
): Promise<{ message: string }> {
  return apiDelete<{ message: string }>(`/api/persons/${id}`)
}

// ---------------------------------------------------------------------------
// Helper — convert a File or Blob to base64 string
// ---------------------------------------------------------------------------

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload  = () => resolve((reader.result as string).split(',')[1])
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}