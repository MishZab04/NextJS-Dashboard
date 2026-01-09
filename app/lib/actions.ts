"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

/* -------------------- Schema -------------------- */
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: "Please select a customer.",
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: "Please enter an amount greater than $0." }),
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "Please select an invoice status.",
  }),
  date: z.string(),
});

/* -------------------- State -------------------- */
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

/* -------------------- CREATE -------------------- */
const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(
  prevState: State,
  formData: FormData
): Promise<State | void> {
  try {
    const validatedFields = CreateInvoice.parse({
      customerId: formData.get("customerId"),
      amount: formData.get("amount"),
      status: formData.get("status"),
    });

    const { customerId, amount, status } = validatedFields;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split("T")[0];

    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;

    revalidatePath("/dashboard/invoices");
    redirect("/dashboard/invoices");
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return {
        errors: error.flatten().fieldErrors,
        message: "Missing or invalid fields. Failed to create invoice.",
      };
    }
    console.error(error);
    return { message: "Database Error: Failed to create invoice." };
  }
}

/* -------------------- UPDATE -------------------- */
const UpdateInvoice = FormSchema.omit({ date: true });

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData
): Promise<State | void> {
  try {
    const validatedFields = UpdateInvoice.parse({
      customerId: formData.get("customerId"),
      amount: formData.get("amount"),
      status: formData.get("status"),
    });

    const { customerId, amount, status } = validatedFields;
    const amountInCents = amount * 100;

    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;

    revalidatePath("/dashboard/invoices");
    redirect("/dashboard/invoices");
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return {
        errors: error.flatten().fieldErrors,
        message: "Missing or invalid fields. Failed to update invoice.",
      };
    }
    console.error(error);
    return { message: "Database Error: Failed to update invoice." };
  }
}

/* -------------------- DELETE -------------------- */
export async function deleteInvoice(id: string): Promise<void> {
  try {
    await sql`
      DELETE FROM invoices
      WHERE id = ${id}
    `;
    revalidatePath("/dashboard/invoices");
  } catch (error) {
    console.error(error);
    throw new Error("Database Error: Failed to delete invoice.");
  }
}
