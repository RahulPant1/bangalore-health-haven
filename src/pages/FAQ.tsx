
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h1>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>How do I find the nearest hospital?</AccordionTrigger>
            <AccordionContent>
              You can use the search bar on our homepage to look for hospitals near you. Enter your area or the hospital name, and you'll see a list of nearby facilities with directions.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2">
            <AccordionTrigger>What do the hospital ratings mean?</AccordionTrigger>
            <AccordionContent>
              Ratings are based on user reviews and range from 1 to 5 stars. They reflect overall patient satisfaction, including factors like care quality, cleanliness, and staff behavior.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3">
            <AccordionTrigger>How can I contact a hospital?</AccordionTrigger>
            <AccordionContent>
              Each hospital listing includes contact information. You can find phone numbers and website links in the hospital details card. Click the "Call" button to directly dial the number.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default FAQ;
