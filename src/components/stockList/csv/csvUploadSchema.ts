import {z} from "zod";
import {CurrencyType} from "../../../model/CurrencyType.ts";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const csvUploadSchema = z.object({
    exchange: z.string().min(2, "Exchange must be at least 2 characters").max(10, "Exchange must be at most 10 characters"),
    ticker: z.string().min(2, "Ticker must be at least 2 characters").max(10, "Ticker must be at most 10 characters"),
    companyName: z.string().min(2, "Company name is too short").max(40, "Company name is too long"),
    currencyType: z.nativeEnum(CurrencyType),
    file: z
        .instanceof(FileList)
        .superRefine((fileList, ctx) => {
            const file = fileList.item(0);
            if (!(file instanceof File)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "CSV file is required",
                });
                return;
            }

            if (!file.name.endsWith(".csv")) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "File must be a CSV",
                });
            }

            if (file.size > MAX_FILE_SIZE) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "File must be smaller than 5MB",
                });
            }
        })
});