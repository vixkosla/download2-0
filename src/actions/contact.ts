'use server';

import * as z from 'zod';

// Updated schema to include phone and make email optional
const formSchema = z.object({
  lastName: z.string().optional().refine(val => !val || val.length >= 2, {
    message: 'Фамилия должна содержать не менее 2 символов.'
  }),
  firstName: z.string().min(2, 'Имя должно содержать не менее 2 символов.'),
  middleName: z.string().optional().refine(val => !val || val.length >= 2, {
    message: 'Отчество должно содержать не менее 2 символов.'
  }),
  phone: z.string().min(10, 'Пожалуйста, введите действительный номер телефона.'),
});

type ContactFormValues = z.infer<typeof formSchema>;

export async function submitContactForm(
  values: ContactFormValues
): Promise<{ success: boolean; message?: string }> {
  const validatedFields = formSchema.safeParse(values);

  if (!validatedFields.success) {
    console.error('Validation failed:', validatedFields.error.flatten().fieldErrors);
    const firstError = Object.values(validatedFields.error.flatten().fieldErrors)[0]?.[0];
    return { success: false, message: firstError || 'Неверные данные формы.' };
  }

  const { lastName, firstName, middleName, phone } = validatedFields.data;

  console.log('Получена заявка на сборку мебели:');
  console.log('Фамилия:', lastName);
  console.log('Имя:', firstName);
  console.log('Отчество:', middleName);
  console.log('Телефон:', phone);

  // --- Placeholder for actual processing/email sending ---
  // Example: Send email notification
  //
  // try {
  //   // Replace with your actual email sending logic
  //   // await sendAssemblyRequestEmail({ name, phone, email, message });
  //   await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  //   return { success: true };
  // } catch (error) {
  //   console.error("Error sending assembly request:", error);
  //   return { success: false, message: "Не удалось отправить заявку." };
  // }
  // --- End Placeholder ---


  // Simulate a successful submission for now
   await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay


  return { success: true };
}
