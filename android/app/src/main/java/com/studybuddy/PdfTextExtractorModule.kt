package com.studybuddy

import com.facebook.react.bridge.*
import com.tom_roush.pdfbox.android.PDFBoxResourceLoader
import com.tom_roush.pdfbox.pdmodel.PDDocument
import com.tom_roush.pdfbox.text.PDFTextStripper
import java.io.File
import java.io.InputStream
import android.net.Uri

class PdfTextExtractorModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "PdfTextExtractor"

    init {
        PDFBoxResourceLoader.init(reactContext)
    }

    @ReactMethod
    fun extractText(uriString: String, promise: Promise) {
        Thread {
            try {
                val inputStream: InputStream = if (uriString.startsWith("content://") || uriString.startsWith("file://")) {
                    val uri = Uri.parse(uriString)
                    reactContext.contentResolver.openInputStream(uri)
                        ?: throw Exception("Could not open file")
                } else {
                    File(uriString).inputStream()
                }

                val document = PDDocument.load(inputStream)
                val stripper = PDFTextStripper()
                val totalPages = document.numberOfPages

                val pagesArray = Arguments.createArray()
                for (i in 1..totalPages) {
                    stripper.startPage = i
                    stripper.endPage = i
                    val pageText = stripper.getText(document)
                    pagesArray.pushString(pageText.trim())
                }

                document.close()
                inputStream.close()

                promise.resolve(pagesArray)
            } catch (e: Exception) {
                promise.reject("PDF_ERROR", "Failed to extract PDF text: ${e.message}", e)
            }
        }.start()
    }
}
