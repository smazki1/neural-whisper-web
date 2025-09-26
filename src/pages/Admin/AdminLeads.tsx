import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Search, Filter, Eye, Edit, Trash2, Mail, Phone, MessageCircle, Calendar, Download, Plus } from "lucide-react";
import { format } from "date-fns";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service_interest?: string;
  message?: string;
  source?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const AdminLeads = () => {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const statusOptions = [
    { value: "new", label: "חדש", color: "bg-blue-100 text-blue-800" },
    { value: "contacted", label: "נוצר קשר", color: "bg-yellow-100 text-yellow-800" },
    { value: "converted", label: "הומר", color: "bg-green-100 text-green-800" },
    { value: "closed", label: "סגור", color: "bg-gray-100 text-gray-800" }
  ];

  const serviceOptions = [
    "הרצאה",
    "סדנה", 
    "ייעוץ אישי",
    "כללי"
  ];

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("leads" as any)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLeads((data || []) as unknown as Lead[]);
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast({
        title: "שגיאה",
        description: "לא ניתן לטעון את הליידים",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("leads" as any)
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", leadId);

      if (error) throw error;

      setLeads(prev => 
        prev.map(lead => 
          lead.id === leadId 
            ? { ...lead, status: newStatus, updated_at: new Date().toISOString() }
            : lead
        )
      );

      toast({
        title: "עודכן בהצלחה",
        description: "סטטוס הליד עודכן"
      });
    } catch (error) {
      console.error("Error updating lead status:", error);
      toast({
        title: "שגיאה",
        description: "לא ניתן לעדכן את הסטטוס",
        variant: "destructive"
      });
    }
  };

  const deleteLead = async (leadId: string) => {
    if (!confirm("האם אתה בטוח שברצונך למחוק את הליד הזה?")) return;

    try {
      const { error } = await supabase
        .from("leads" as any)
        .delete()
        .eq("id", leadId);

      if (error) throw error;

      setLeads(prev => prev.filter(lead => lead.id !== leadId));
      toast({
        title: "נמחק בהצלחה",
        description: "הליד נמחק מהמערכת"
      });
    } catch (error) {
      console.error("Error deleting lead:", error);
      toast({
        title: "שגיאה",
        description: "לא ניתן למחוק את הליד",
        variant: "destructive"
      });
    }
  };

  const exportLeads = () => {
    const csvContent = [
      ["שם", "אימייל", "טלפון", "חברה", "סוג פניה", "הודעה", "מקור", "סטטוס", "תאריך יצירה"].join(","),
      ...filteredLeads.map(lead => [
        lead.name,
        lead.email,
        lead.phone || "",
        lead.company || "",
        lead.service_interest || "",
        `"${lead.message?.replace(/"/g, '""') || ""}"`,
        lead.source || "",
        lead.status,
        format(new Date(lead.created_at), "dd/MM/yyyy HH:mm")
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `leads_${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateWhatsAppUrl = (lead: Lead) => {
    const message = `שלום ${lead.name}, תודה על הפניה שלך ל${lead.service_interest}. `;
    return `https://wa.me/${lead.phone?.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`;
  };

  const generateEmailUrl = (lead: Lead) => {
    const subject = `תגובה לפניה שלך - ${lead.service_interest}`;
    const body = `שלום ${lead.name},\n\nתודה על הפניה שלך.\n\n${responseMessage}\n\nמחכה לשמוע ממך,\nאבי פריד`;
    return `mailto:${lead.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.message?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    const matchesService = serviceFilter === "all" || lead.service_interest === serviceFilter;

    return matchesSearch && matchesStatus && matchesService;
  });

  const getStatusBadge = (status: string) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    return (
      <Badge className={statusOption?.color || "bg-gray-100 text-gray-800"}>
        {statusOption?.label || status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">טוען נתונים...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">ניהול ליידים</h1>
        <p className="text-muted-foreground">נהל את כל הפניות והליידים שהתקבלו</p>
      </div>

      {/* Filters and Actions */}
      <Card className="mb-6 p-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="חיפוש לפי שם, אימייל או הודעה..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="סטטוס" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל הסטטוסים</SelectItem>
                {statusOptions.map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="שירות" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל השירותים</SelectItem>
                {serviceOptions.map(service => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button onClick={exportLeads} variant="outline" size="sm">
              <Download className="w-4 h-4 ml-2" />
              ייצוא CSV
            </Button>
            <Button onClick={fetchLeads} variant="outline" size="sm">
              רענון
            </Button>
          </div>
        </div>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{leads.length}</div>
          <div className="text-sm text-muted-foreground">סך הכל ליידים</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{leads.filter(l => l.status === 'new').length}</div>
          <div className="text-sm text-muted-foreground">חדשים</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{leads.filter(l => l.status === 'converted').length}</div>
          <div className="text-sm text-muted-foreground">הומרו</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {Math.round((leads.filter(l => l.status === 'converted').length / Math.max(leads.length, 1)) * 100)}%
          </div>
          <div className="text-sm text-muted-foreground">שיעור המרה</div>
        </Card>
      </div>

      {/* Leads Table */}
      <Card>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right pb-3 pr-4">שם</th>
                  <th className="text-right pb-3 pr-4">פרטי התקשרות</th>
                  <th className="text-right pb-3 pr-4">סוג פניה</th>
                  <th className="text-right pb-3 pr-4">מקור</th>
                  <th className="text-right pb-3 pr-4">סטטוס</th>
                  <th className="text-right pb-3 pr-4">תאריך</th>
                  <th className="text-right pb-3 pr-4">פעולות</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-b hover:bg-muted/50">
                    <td className="py-4 pr-4">
                      <div>
                        <div className="font-medium">{lead.name}</div>
                        {lead.company && (
                          <div className="text-sm text-muted-foreground">{lead.company}</div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <div className="space-y-1">
                        <div className="text-sm">{lead.email}</div>
                        {lead.phone && (
                          <div className="text-sm text-muted-foreground">{lead.phone}</div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <Badge variant="secondary">{lead.service_interest || "לא צוין"}</Badge>
                    </td>
                    <td className="py-4 pr-4">
                      <span className="text-sm text-muted-foreground">{lead.source || "לא ידוע"}</span>
                    </td>
                    <td className="py-4 pr-4">
                      <Select 
                        value={lead.status} 
                        onValueChange={(value) => updateLeadStatus(lead.id, value)}
                      >
                        <SelectTrigger className="w-32 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map(status => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-4 pr-4">
                      <div className="text-sm">
                        {format(new Date(lead.created_at), "dd/MM/yyyy")}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(lead.created_at), "HH:mm")}
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedLead(lead);
                            setIsViewModalOpen(true);
                          }}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        
                        {lead.phone && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => window.open(generateWhatsAppUrl(lead), '_blank')}
                            className="text-green-600"
                          >
                            <MessageCircle className="w-3 h-3" />
                          </Button>
                        )}
                        
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedLead(lead);
                            setIsResponseModalOpen(true);
                          }}
                        >
                          <Mail className="w-3 h-3" />
                        </Button>
                        
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => deleteLead(lead.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredLeads.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              לא נמצאו ליידים המתאימים לחיפוש
            </div>
          )}
        </div>
      </Card>

      {/* View Lead Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>פרטי הליד - {selectedLead?.name}</DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">שם מלא</Label>
                  <p>{selectedLead.name}</p>
                </div>
                <div>
                  <Label className="font-medium">אימייל</Label>
                  <p>{selectedLead.email}</p>
                </div>
                <div>
                  <Label className="font-medium">טלפון</Label>
                  <p>{selectedLead.phone || "לא צוין"}</p>
                </div>
                <div>
                  <Label className="font-medium">חברה</Label>
                  <p>{selectedLead.company || "לא צוין"}</p>
                </div>
                <div>
                  <Label className="font-medium">סוג פניה</Label>
                  <p>{selectedLead.service_interest || "לא צוין"}</p>
                </div>
                <div>
                  <Label className="font-medium">מקור</Label>
                  <p>{selectedLead.source || "לא ידוע"}</p>
                </div>
              </div>
              
              <div>
                <Label className="font-medium">הודעה</Label>
                <div className="bg-muted p-3 rounded-md mt-2">
                  <p className="whitespace-pre-wrap">{selectedLead.message || "לא נכתבה הודעה"}</p>
                </div>
              </div>
              
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>נוצר: {format(new Date(selectedLead.created_at), "dd/MM/yyyy HH:mm")}</span>
                <span>עודכן: {format(new Date(selectedLead.updated_at), "dd/MM/yyyy HH:mm")}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Response Modal */}
      <Dialog open={isResponseModalOpen} onOpenChange={setIsResponseModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>שלח תגובה ל-{selectedLead?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="response" className="font-medium">הודעת תגובה</Label>
              <Textarea
                id="response"
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                placeholder="כתוב את ההודעה שלך כאן..."
                rows={4}
                className="mt-2"
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => {
                  if (selectedLead) {
                    window.open(generateEmailUrl(selectedLead), '_blank');
                    setIsResponseModalOpen(false);
                    setResponseMessage("");
                  }
                }}
                className="flex-1"
              >
                <Mail className="w-4 h-4 ml-2" />
                שלח באימייל
              </Button>
              
              {selectedLead?.phone && (
                <Button 
                  variant="outline"
                  onClick={() => {
                    const message = `שלום ${selectedLead.name}, ${responseMessage}`;
                    const whatsappUrl = `https://wa.me/${selectedLead.phone?.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`;
                    window.open(whatsappUrl, '_blank');
                    setIsResponseModalOpen(false);
                    setResponseMessage("");
                  }}
                  className="flex-1 text-green-600"
                >
                  <MessageCircle className="w-4 h-4 ml-2" />
                  שלח בוואטסאפ
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLeads;