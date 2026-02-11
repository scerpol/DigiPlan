import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@shared/routes";
import type { InsertInquiry } from "@shared/schema";
import { useCreateInquiry } from "@/hooks/use-inquiries";
import { Loader2, Send, Paperclip, X } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const { mutate, isPending } = useCreateInquiry();
  const [fileName, setFileName] = useState<string>("");

  const form = useForm<InsertInquiry & { attachment?: string }>({
    resolver: zodResolver(api.inquiries.create.input),
    defaultValues: {
      name: "",
      email: "",
      package: "Base",
      message: "",
      attachment: "",
    },
  });

  // Listen for custom event from pricing cards
  useEffect(() => {
    const handlePackageSelect = (e: CustomEvent<string>) => {
      form.setValue("package", e.detail);
    };

    window.addEventListener("select-package", handlePackageSelect as EventListener);
    return () =>
      window.removeEventListener(
        "select-package",
        handlePackageSelect as EventListener
      );
  }, [form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onloadend = () => {
      form.setValue("attachment", String(reader.result || ""));
    };
    reader.readAsDataURL(file);
  };

  function onSubmit(data: InsertInquiry & { attachment?: string }) {
    mutate(data, {
      onSuccess: () => {
        form.reset({
          name: "",
          email: "",
          package: "Base",
          message: "",
          attachment: "",
        });
        setFileName("");
      },
    });
  }

  return (
    <div className="bg-white rounded-3xl p-6 md:p-12 shadow-2xl border border-gray-100 w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 md:space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-gray-700 font-medium">
                    Nome
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Mario Rossi"
                      className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all h-10 md:h-12"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-gray-700 font-medium">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="mario@esempio.it"
                      className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all h-10 md:h-12"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="package"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-gray-700 font-medium">
                  Pacchetto
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all h-10 md:h-12 shadow-none">
                      <SelectValue placeholder="Seleziona un pacchetto" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white opacity-100 shadow-xl border-gray-200">
                    <SelectItem value="Base">Piano Base (€50)</SelectItem>
                    <SelectItem value="Premium">Piano Premium (€150)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-gray-700 font-medium">
                  Messaggio
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Raccontaci del tuo progetto..."
                    className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all min-h-[100px] md:min-h-[150px] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-1.5">
            <label className="text-gray-700 font-medium block">
              Allega planimetria (opzionale)
            </label>

            <div className="flex items-center gap-4">
              <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl transition-all flex items-center gap-2 text-sm font-medium">
                <Paperclip className="w-4 h-4" />
                Scegli file
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.png,.jpg,.jpeg,.dwg"
                />
              </label>

              {fileName && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 truncate max-w-[200px]">
                    {fileName}
                  </span>
                  <button
                    type="button"
                    data-testid="button-remove-attachment"
                    onClick={() => {
                      setFileName("");
                      form.setValue("attachment", "");
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Rimuovi allegato"
                    title="Rimuovi allegato"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-gradient-to-r from-primary to-accent text-white py-3 md:py-4 rounded-xl font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-300 flex items-center justify-center gap-2 mt-2"
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Invio in corso...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Invia Richiesta
              </>
            )}
          </button>
        </form>
      </Form>
    </div>
  );
}
