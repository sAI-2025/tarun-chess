import { useState, useEffect, useRef, DragEvent, createContext, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useSiteData } from '@/contexts/SiteDataContext';
import {
  validateAdmin,
  isAdminLoggedIn,
  setAdminLoggedIn,
  generateId,
  getAdminPassword,
  setAdminPassword,
  getAdminEmail,
  setAdminEmail
} from '@/lib/siteData';
import type { SiteData, UpcomingEvent, Program, EventSection, PastBootcamp, EventPageCard, AboutFeature, HomePageData } from '@/lib/siteData';
import { Trash2, Plus, GripVertical, LogOut, Eye, Save, RotateCcw, Lock, Pencil, Calendar, BookOpen, LayoutGrid, CheckCircle, AlertCircle, User, Home, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

// ─── Draft Context ───────────────────────────────────────────────────
interface DraftContextType {
  draft: SiteData;
  setDraft: React.Dispatch<React.SetStateAction<SiteData>>;
  hasChanges: boolean;
}
const DraftContext = createContext<DraftContextType | null>(null);
function useDraft() {
  const ctx = useContext(DraftContext);
  if (!ctx) throw new Error('useDraft must be used within DraftContext');
  return ctx;
}

// ─── Drag-and-drop hook ─────────────────────────────────────────────
function useDragReorder<T>(items: T[], onReorder: (items: T[]) => void) {
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const handleDragStart = (index: number) => (e: DragEvent) => {
    dragItem.current = index;
    setDraggingIdx(index);
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleDragEnter = (index: number) => () => {
    dragOverItem.current = index;
    setDragOverIdx(index);
  };
  const handleDragOver = (e: DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };
  const handleDrop = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    if (dragItem.current === dragOverItem.current) { setDraggingIdx(null); setDragOverIdx(null); return; }
    const updated = [...items];
    const [removed] = updated.splice(dragItem.current, 1);
    updated.splice(dragOverItem.current, 0, removed);
    onReorder(updated);
    dragItem.current = null; dragOverItem.current = null;
    setDraggingIdx(null); setDragOverIdx(null);
  };
  const handleDragEnd = () => { setDraggingIdx(null); setDragOverIdx(null); dragItem.current = null; dragOverItem.current = null; };

  return { draggingIdx, dragOverIdx, handleDragStart, handleDragEnter, handleDragOver, handleDrop, handleDragEnd };
}

// ─── Login ───────────────────────────────────────────────────────────
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAdmin(email, password)) { setAdminLoggedIn(true); onLogin(); }
    else { setError('Invalid credentials'); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <Card className="w-full max-w-md shadow-xl border-primary/20">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="font-display text-2xl">Admin Login</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Sign in to manage your site content</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            {error && <p className="text-sm text-destructive font-medium">{error}</p>}
            <Button type="submit" className="w-full h-11 text-base font-semibold">Sign In</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Change Credentials ──────────────────────────────────────────────
function ChangeCredentialsSection() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newLoginId, setNewLoginId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPassword !== getAdminPassword()) { toast.error('Current password is incorrect'); return; }
    let changed = false;
    if (newLoginId.trim()) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newLoginId.trim())) { toast.error('Please enter a valid email for the new Login ID'); return; }
      setAdminEmail(newLoginId.trim());
      changed = true;
    }
    if (newPassword) {
      if (newPassword.length < 6) { toast.error('New password must be at least 6 characters'); return; }
      if (newPassword !== confirmPassword) { toast.error('New passwords do not match'); return; }
      setAdminPassword(newPassword);
      changed = true;
    }
    if (!changed) { toast.error('Please enter a new Login ID or new password'); return; }
    setCurrentPassword(''); setNewLoginId(''); setNewPassword(''); setConfirmPassword('');
    toast.success('Credentials updated successfully');
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lock className="h-5 w-5 text-primary" /> Change Credentials
        </CardTitle>
        <p className="text-sm text-muted-foreground">Update your login email and/or password. Current Login ID: <span className="font-medium text-foreground">{getAdminEmail()}</span></p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password *</Label>
            <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Enter current password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newLoginId">New Login ID (Email)</Label>
            <Input id="newLoginId" type="email" value={newLoginId} onChange={(e) => setNewLoginId(e.target.value)} placeholder={getAdminEmail()} />
            <p className="text-xs text-muted-foreground">Leave blank to keep current login email</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Leave blank to keep current" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter new password" />
          </div>
          <Button type="submit" className="font-semibold">Update Credentials</Button>
        </form>
      </CardContent>
    </Card>
  );
}

// ─── Draggable Card Wrapper ──────────────────────────────────────────
function DraggableCard({
  index, draggingIdx, dragOverIdx, handleDragStart, handleDragEnter, handleDragOver, handleDrop, handleDragEnd, children
}: {
  index: number; draggingIdx: number | null; dragOverIdx: number | null;
  handleDragStart: (i: number) => (e: DragEvent) => void;
  handleDragEnter: (i: number) => () => void;
  handleDragOver: (e: DragEvent) => void;
  handleDrop: () => void; handleDragEnd: () => void;
  children: React.ReactNode;
}) {
  const isDragging = draggingIdx === index;
  const isOver = dragOverIdx === index && draggingIdx !== index;
  return (
    <div draggable onDragStart={handleDragStart(index)} onDragEnter={handleDragEnter(index)} onDragOver={handleDragOver} onDrop={handleDrop} onDragEnd={handleDragEnd}
      className={`transition-all duration-200 rounded-lg ${isDragging ? 'opacity-40 scale-[0.98]' : ''} ${isOver ? 'ring-2 ring-primary/50 ring-offset-2' : ''}`}>
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="py-4">{children}</CardContent>
      </Card>
    </div>
  );
}

// ─── Upcoming Events Editor (draft-based) ────────────────────────────
function UpcomingEventsEditor() {
  const { draft, setDraft } = useDraft();
  const events = draft.upcomingEvents;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState<Partial<UpcomingEvent>>({ title: '', date: '', type: 'Classes', description: '' });

  const setEvents = (updated: UpcomingEvent[]) => setDraft(prev => ({ ...prev, upcomingEvents: updated }));

  const handleAdd = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.type) { toast.error('Please fill in all required fields'); return; }
    setEvents([...events, { id: generateId(), title: newEvent.title!, date: newEvent.date!, type: newEvent.type!, description: newEvent.description }]);
    setNewEvent({ title: '', date: '', type: 'Classes', description: '' });
    toast.info('Event added to draft — click Update to publish');
  };

  const handleUpdate = (id: string, data: Partial<UpcomingEvent>) => setEvents(events.map((e) => (e.id === id ? { ...e, ...data } : e)));
  const handleDelete = (id: string) => { if (confirm('Delete this event?')) { setEvents(events.filter((e) => e.id !== id)); toast.info('Event removed — click Update to publish'); } };
  const drag = useDragReorder(events, setEvents);

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border-dashed border-2 border-primary/20 bg-primary/[0.02]">
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Plus className="h-5 w-5 text-primary" /> Add New Event</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Event Title *</Label><Input value={newEvent.title || ''} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} placeholder="Spring Group Classes Begin" /></div>
            <div className="space-y-2"><Label>Date *</Label><Input value={newEvent.date || ''} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} placeholder="Mar 15, 2026" /></div>
            <div className="space-y-2"><Label>Category *</Label>
              <Select value={newEvent.type || 'Classes'} onValueChange={(v) => setNewEvent({ ...newEvent, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Classes">Classes</SelectItem><SelectItem value="Camp">Camp</SelectItem>
                  <SelectItem value="Workshop">Workshop</SelectItem><SelectItem value="Tournament">Tournament</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Description (optional)</Label><Input value={newEvent.description || ''} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} placeholder="Optional description" /></div>
          </div>
          <Button onClick={handleAdd} className="font-semibold"><Plus className="h-4 w-4 mr-1" /> Add Event</Button>
        </CardContent>
      </Card>
      <p className="text-xs text-muted-foreground flex items-center gap-1"><GripVertical className="h-3 w-3" /> Drag cards to reorder</p>
      <div className="space-y-3">
        {events.map((event, index) => (
          <DraggableCard key={event.id} index={index} {...drag}>
            {editingId === event.id ? (
              <div className="space-y-3">
                <Input value={event.title} onChange={(e) => handleUpdate(event.id, { title: e.target.value })} placeholder="Title" />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input value={event.date} onChange={(e) => handleUpdate(event.id, { date: e.target.value })} placeholder="Date" />
                  <Select value={event.type} onValueChange={(v) => handleUpdate(event.id, { type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="Classes">Classes</SelectItem><SelectItem value="Camp">Camp</SelectItem><SelectItem value="Workshop">Workshop</SelectItem><SelectItem value="Tournament">Tournament</SelectItem></SelectContent>
                  </Select>
                </div>
                <Input value={event.description || ''} onChange={(e) => handleUpdate(event.id, { description: e.target.value })} placeholder="Description (optional)" />
                <Button size="sm" onClick={() => setEditingId(null)} className="font-semibold"><Save className="h-4 w-4 mr-1" /> Done</Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors p-1"><GripVertical className="h-5 w-5" /></div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{event.title}</p>
                  <p className="text-sm text-muted-foreground">{event.date} · {event.type}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditingId(event.id)} className="gap-1.5"><Pencil className="h-3.5 w-3.5" /> Edit</Button>
                  <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDelete(event.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            )}
          </DraggableCard>
        ))}
      </div>
    </div>
  );
}

// ─── Programs Editor (draft-based) ──────────────────────────────────
function ProgramsEditor() {
  const { draft, setDraft } = useDraft();
  const programs = draft.programs;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newProgram, setNewProgram] = useState<Partial<Program>>({ title: '', description: '', iconType: 'users' });

  const setPrograms = (updated: Program[]) => setDraft(prev => ({ ...prev, programs: updated }));

  const handleAdd = () => {
    if (!newProgram.title || !newProgram.description) { toast.error('Please fill in all required fields'); return; }
    setPrograms([...programs, { id: generateId(), title: newProgram.title!, description: newProgram.description!, iconType: newProgram.iconType || 'users' }]);
    setNewProgram({ title: '', description: '', iconType: 'users' });
    toast.info('Program added to draft — click Update to publish');
  };

  const handleUpdate = (id: string, data: Partial<Program>) => setPrograms(programs.map((p) => (p.id === id ? { ...p, ...data } : p)));
  const handleDelete = (id: string) => { if (confirm('Delete this program?')) { setPrograms(programs.filter((p) => p.id !== id)); toast.info('Program removed — click Update to publish'); } };
  const drag = useDragReorder(programs, setPrograms);

  const iconOptions = [
    { value: 'users', label: 'Group (Users)' }, { value: 'user', label: 'Individual (User)' },
    { value: 'monitor', label: 'Online (Monitor)' }, { value: 'layers', label: 'Levels (Layers)' },
    { value: 'swords', label: 'Competition (Swords)' },
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border-dashed border-2 border-primary/20 bg-primary/[0.02]">
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Plus className="h-5 w-5 text-primary" /> Add New Program</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Program Title *</Label><Input value={newProgram.title || ''} onChange={(e) => setNewProgram({ ...newProgram, title: e.target.value })} placeholder="Group Classes" /></div>
            <div className="space-y-2"><Label>Icon Type</Label>
              <Select value={newProgram.iconType || 'users'} onValueChange={(v: Program['iconType']) => setNewProgram({ ...newProgram, iconType: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{iconOptions.map((opt) => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2"><Label>Description *</Label><Textarea value={newProgram.description || ''} onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })} placeholder="Learn alongside peers..." rows={3} /></div>
          <Button onClick={handleAdd} className="font-semibold"><Plus className="h-4 w-4 mr-1" /> Add Program</Button>
        </CardContent>
      </Card>
      <p className="text-xs text-muted-foreground flex items-center gap-1"><GripVertical className="h-3 w-3" /> Drag cards to reorder</p>
      <div className="space-y-3">
        {programs.map((program, index) => (
          <DraggableCard key={program.id} index={index} {...drag}>
            {editingId === program.id ? (
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input value={program.title} onChange={(e) => handleUpdate(program.id, { title: e.target.value })} placeholder="Title" />
                  <Select value={program.iconType} onValueChange={(v: Program['iconType']) => handleUpdate(program.id, { iconType: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{iconOptions.map((opt) => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <Textarea value={program.description} onChange={(e) => handleUpdate(program.id, { description: e.target.value })} rows={3} />
                <Button size="sm" onClick={() => setEditingId(null)} className="font-semibold"><Save className="h-4 w-4 mr-1" /> Done</Button>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <div className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors p-1 pt-1"><GripVertical className="h-5 w-5" /></div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{program.title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{program.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditingId(program.id)} className="gap-1.5"><Pencil className="h-3.5 w-3.5" /> Edit</Button>
                  <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDelete(program.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            )}
          </DraggableCard>
        ))}
      </div>
    </div>
  );
}

// ─── Event Sections Editor (draft-based) ─────────────────────────────
function EventSectionsEditor() {
  const { draft, setDraft } = useDraft();
  const sections = draft.eventSections;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newSection, setNewSection] = useState<Partial<EventSection>>({ title: '', description: '', iconType: 'tent' });

  const setSections = (updated: EventSection[]) => setDraft(prev => ({ ...prev, eventSections: updated }));

  const handleAdd = () => {
    if (!newSection.title || !newSection.description) { toast.error('Please fill in all required fields'); return; }
    setSections([...sections, { id: generateId(), title: newSection.title!, description: newSection.description!, iconType: newSection.iconType || 'tent' }]);
    setNewSection({ title: '', description: '', iconType: 'tent' });
    toast.info('Section added to draft — click Update to publish');
  };

  const handleUpdate = (id: string, data: Partial<EventSection>) => setSections(sections.map((s) => (s.id === id ? { ...s, ...data } : s)));
  const handleDelete = (id: string) => { if (confirm('Delete this section?')) { setSections(sections.filter((s) => s.id !== id)); toast.info('Section removed — click Update to publish'); } };

  const drag = useDragReorder(sections, setSections);

  const iconOptions = [
    { value: 'tent', label: 'Camp (Tent)' }, { value: 'trophy', label: 'Tournament (Trophy)' },
    { value: 'lightbulb', label: 'Workshop (Lightbulb)' }, { value: 'info', label: 'Info' },
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border-dashed border-2 border-primary/20 bg-primary/[0.02]">
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Plus className="h-5 w-5 text-primary" /> Add New Event Section</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Section Title *</Label><Input value={newSection.title || ''} onChange={(e) => setNewSection({ ...newSection, title: e.target.value })} placeholder="Summer Camps" /></div>
            <div className="space-y-2"><Label>Icon Type</Label>
              <Select value={newSection.iconType || 'tent'} onValueChange={(v: EventSection['iconType']) => setNewSection({ ...newSection, iconType: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{iconOptions.map((opt) => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2"><Label>Description *</Label><Textarea value={newSection.description || ''} onChange={(e) => setNewSection({ ...newSection, description: e.target.value })} placeholder="Immersive multi-day chess bootcamps..." rows={2} /></div>
          <Button onClick={handleAdd} className="font-semibold"><Plus className="h-4 w-4 mr-1" /> Add Section</Button>
        </CardContent>
      </Card>
      <p className="text-xs text-muted-foreground flex items-center gap-1"><GripVertical className="h-3 w-3" /> Drag cards to reorder</p>
      <div className="space-y-3">
        {sections.map((section, index) => (
          <DraggableCard key={section.id} index={index} {...drag}>
            {editingId === section.id ? (
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input value={section.title} onChange={(e) => handleUpdate(section.id, { title: e.target.value })} placeholder="Title" />
                  <Select value={section.iconType} onValueChange={(v: EventSection['iconType']) => handleUpdate(section.id, { iconType: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{iconOptions.map((opt) => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <Textarea value={section.description} onChange={(e) => handleUpdate(section.id, { description: e.target.value })} rows={2} />
                <Button size="sm" onClick={() => setEditingId(null)} className="font-semibold"><Save className="h-4 w-4 mr-1" /> Done</Button>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <div className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors p-1 pt-1"><GripVertical className="h-5 w-5" /></div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{section.title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{section.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditingId(section.id)} className="gap-1.5"><Pencil className="h-3.5 w-3.5" /> Edit</Button>
                  <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDelete(section.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            )}
          </DraggableCard>
        ))}
      </div>

      {/* Event Page Cards */}
      <EventPageCardsEditor />
    </div>
  );
}

// ─── Event Page Cards Editor (draft-based) ───────────────────────────
function EventPageCardsEditor() {
  const { draft, setDraft } = useDraft();
  const cards = draft.eventsPageCards || [];
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCard, setNewCard] = useState<Partial<EventPageCard>>({ title: '', description: '', extraText: '' });

  const setCards = (updated: EventPageCard[]) => setDraft(prev => ({ ...prev, eventsPageCards: updated }));

  const handleAdd = () => {
    if (!newCard.title || !newCard.description) { toast.error('Please fill in Title and Description'); return; }
    setCards([...cards, { id: generateId(), title: newCard.title!, description: newCard.description!, extraText: newCard.extraText || undefined }]);
    setNewCard({ title: '', description: '', extraText: '' });
    toast.info('Event card added to draft — click Update to publish');
  };

  const handleUpdate = (id: string, data: Partial<EventPageCard>) => setCards(cards.map((c) => (c.id === id ? { ...c, ...data } : c)));
  const handleDelete = (id: string) => { if (confirm('Delete this event card?')) { setCards(cards.filter((c) => c.id !== id)); toast.info('Card removed — click Update to publish'); } };
  const drag = useDragReorder(cards, setCards);

  return (
    <div className="space-y-6">
      <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2 pt-4 border-t">
        <BookOpen className="h-5 w-5 text-primary" /> Event Page Cards
      </h3>

      <Card className="shadow-sm border-dashed border-2 border-primary/20 bg-primary/[0.02]">
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Plus className="h-5 w-5 text-primary" /> Add Event Card</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>Event Title *</Label><Input value={newCard.title || ''} onChange={(e) => setNewCard({ ...newCard, title: e.target.value })} placeholder="Past Bootcamp: Summer Chess Camp 2025" /></div>
          <div className="space-y-2"><Label>Description *</Label><Textarea value={newCard.description || ''} onChange={(e) => setNewCard({ ...newCard, description: e.target.value })} placeholder="Describe the event..." rows={3} /></div>
          <div className="space-y-2"><Label>Extra Text (optional)</Label><Textarea value={newCard.extraText || ''} onChange={(e) => setNewCard({ ...newCard, extraText: e.target.value })} placeholder="Additional details, cost info, etc." rows={2} /></div>
          <Button onClick={handleAdd} className="font-semibold"><Plus className="h-4 w-4 mr-1" /> Add Card</Button>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground flex items-center gap-1"><GripVertical className="h-3 w-3" /> Drag cards to reorder</p>
      <div className="space-y-3">
        {cards.map((card, index) => (
          <DraggableCard key={card.id} index={index} {...drag}>
            {editingId === card.id ? (
              <div className="space-y-3">
                <div className="space-y-2"><Label>Title</Label><Input value={card.title} onChange={(e) => handleUpdate(card.id, { title: e.target.value })} /></div>
                <div className="space-y-2"><Label>Description</Label><Textarea value={card.description} onChange={(e) => handleUpdate(card.id, { description: e.target.value })} rows={3} /></div>
                <div className="space-y-2"><Label>Extra Text</Label><Textarea value={card.extraText || ''} onChange={(e) => handleUpdate(card.id, { extraText: e.target.value })} rows={2} /></div>
                <Button size="sm" onClick={() => setEditingId(null)} className="font-semibold"><Save className="h-4 w-4 mr-1" /> Done</Button>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <div className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors p-1 pt-1"><GripVertical className="h-5 w-5" /></div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{card.title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{card.description}</p>
                  {card.extraText && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{card.extraText}</p>}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditingId(card.id)} className="gap-1.5"><Pencil className="h-3.5 w-3.5" /> Edit</Button>
                  <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDelete(card.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            )}
          </DraggableCard>
        ))}
      </div>
    </div>
  );
}

// ─── About Page Editor (draft-based) ─────────────────────────────────
function AboutPageEditor() {
  const { draft, setDraft } = useDraft();
  const about = draft.aboutPage;
  const [editingFeatureId, setEditingFeatureId] = useState<string | null>(null);
  const [newFeature, setNewFeature] = useState<Partial<AboutFeature>>({ title: '', description: '', iconType: 'book' });

  const updateAbout = (data: Partial<typeof about>) => setDraft(prev => ({ ...prev, aboutPage: { ...prev.aboutPage, ...data } }));
  const setFeatures = (features: AboutFeature[]) => updateAbout({ features });

  const handleAddFeature = () => {
    if (!newFeature.title || !newFeature.description) { toast.error('Please fill in title and description'); return; }
    setFeatures([...about.features, { id: generateId(), title: newFeature.title!, description: newFeature.description!, iconType: newFeature.iconType || 'book' }]);
    setNewFeature({ title: '', description: '', iconType: 'book' });
    toast.info('Feature added to draft — click Update to publish');
  };

  const handleUpdateFeature = (id: string, data: Partial<AboutFeature>) => setFeatures(about.features.map(f => f.id === id ? { ...f, ...data } : f));
  const handleDeleteFeature = (id: string) => { if (confirm('Delete this feature card?')) { setFeatures(about.features.filter(f => f.id !== id)); toast.info('Feature removed — click Update to publish'); } };
  const drag = useDragReorder(about.features, setFeatures);

  const iconOptions = [
    { value: 'book', label: 'Book' }, { value: 'target', label: 'Target' },
    { value: 'star', label: 'Star' }, { value: 'user', label: 'User' },
  ];

  return (
    <div className="space-y-8">
      {/* Our Story */}
      <Card className="shadow-sm">
        <CardHeader><CardTitle className="text-lg">Our Story</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Section Title</Label>
            <Input value={about.storyTitle} onChange={e => updateAbout({ storyTitle: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Content (separate paragraphs with blank lines)</Label>
            <Textarea value={about.storyParagraphs.join('\n\n')} onChange={e => updateAbout({ storyParagraphs: e.target.value.split(/\n\s*\n/).filter(Boolean) })} rows={10} />
          </div>
        </CardContent>
      </Card>

      {/* Mission & Vision */}
      <Card className="shadow-sm">
        <CardHeader><CardTitle className="text-lg">Mission & Vision</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Mission Title</Label>
              <Input value={about.missionTitle} onChange={e => updateAbout({ missionTitle: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Vision Title</Label>
              <Input value={about.visionTitle} onChange={e => updateAbout({ visionTitle: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Mission Text</Label>
            <Textarea value={about.missionText} onChange={e => updateAbout({ missionText: e.target.value })} rows={3} />
          </div>
          <div className="space-y-2">
            <Label>Vision Text</Label>
            <Textarea value={about.visionText} onChange={e => updateAbout({ visionText: e.target.value })} rows={3} />
          </div>
        </CardContent>
      </Card>

      {/* Meet the Coach */}
      <Card className="shadow-sm">
        <CardHeader><CardTitle className="text-lg">Meet the Coach</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Section Title</Label>
              <Input value={about.coachSectionTitle} onChange={e => updateAbout({ coachSectionTitle: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Coach Name</Label>
              <Input value={about.coachName} onChange={e => updateAbout({ coachName: e.target.value })} />
            </div>
          </div>
          {/* Coach Photo Upload */}
          <div className="space-y-2">
            <Label>Coach Photo</Label>
            <div className="flex items-center gap-4">
              <div className="h-20 w-16 rounded-lg overflow-hidden bg-muted border flex items-center justify-center shrink-0">
                {about.coachPhotoUrl ? (
                  <img src={about.coachPhotoUrl} alt="Coach preview" className="h-full w-full object-cover object-top" />
                ) : (
                  <User className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (file.size > 2 * 1024 * 1024) { toast.error('Image must be under 2MB'); return; }
                      const reader = new FileReader();
                      reader.onload = () => updateAbout({ coachPhotoUrl: reader.result as string });
                      reader.readAsDataURL(file);
                    }}
                  />
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                    <Upload className="h-3.5 w-3.5" /> Upload Photo
                  </span>
                </label>
                {about.coachPhotoUrl && (
                  <Button variant="ghost" size="sm" className="gap-1 text-destructive hover:text-destructive w-fit h-7 px-2" onClick={() => updateAbout({ coachPhotoUrl: undefined })}>
                    <X className="h-3.5 w-3.5" /> Remove (use default)
                  </Button>
                )}
                <p className="text-xs text-muted-foreground">Max 2MB. Leave empty to use default photo.</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Coach Bio (separate paragraphs with blank lines)</Label>
            <Textarea value={about.coachParagraphs.join('\n\n')} onChange={e => updateAbout({ coachParagraphs: e.target.value.split(/\n\s*\n/).filter(Boolean) })} rows={8} />
          </div>
        </CardContent>
      </Card>

      {/* Why Choose Us Features */}
      <div className="space-y-6">
        <h3 className="font-display text-lg font-semibold text-foreground">Why Choose Us — Feature Cards</h3>
        <Card className="shadow-sm border-dashed border-2 border-primary/20 bg-primary/[0.02]">
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Plus className="h-5 w-5 text-primary" /> Add Feature Card</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Title *</Label><Input value={newFeature.title || ''} onChange={e => setNewFeature({ ...newFeature, title: e.target.value })} placeholder="Feature title" /></div>
              <div className="space-y-2"><Label>Icon</Label>
                <Select value={newFeature.iconType || 'book'} onValueChange={(v: AboutFeature['iconType']) => setNewFeature({ ...newFeature, iconType: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{iconOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2"><Label>Description *</Label><Textarea value={newFeature.description || ''} onChange={e => setNewFeature({ ...newFeature, description: e.target.value })} rows={2} placeholder="Feature description" /></div>
            <Button onClick={handleAddFeature} className="font-semibold"><Plus className="h-4 w-4 mr-1" /> Add Feature</Button>
          </CardContent>
        </Card>
        <p className="text-xs text-muted-foreground flex items-center gap-1"><GripVertical className="h-3 w-3" /> Drag cards to reorder</p>
        <div className="space-y-3">
          {about.features.map((feature, index) => (
            <DraggableCard key={feature.id} index={index} {...drag}>
              {editingFeatureId === feature.id ? (
                <div className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input value={feature.title} onChange={e => handleUpdateFeature(feature.id, { title: e.target.value })} placeholder="Title" />
                    <Select value={feature.iconType} onValueChange={(v: AboutFeature['iconType']) => handleUpdateFeature(feature.id, { iconType: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{iconOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <Textarea value={feature.description} onChange={e => handleUpdateFeature(feature.id, { description: e.target.value })} rows={2} />
                  <Button size="sm" onClick={() => setEditingFeatureId(null)} className="font-semibold"><Save className="h-4 w-4 mr-1" /> Done</Button>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <div className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors p-1 pt-1"><GripVertical className="h-5 w-5" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{feature.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{feature.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingFeatureId(feature.id)} className="gap-1.5"><Pencil className="h-3.5 w-3.5" /> Edit</Button>
                    <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDeleteFeature(feature.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              )}
            </DraggableCard>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Admin Panel ────────────────────────────────────────────────
function AdminPanel() {
  const navigate = useNavigate();
  const { siteData, updateSiteData, resetToDefault } = useSiteData();

  // Draft state — changes here do NOT affect the live site until "Update" is clicked
  const [draft, setDraft] = useState<SiteData>(siteData);

  // Re-sync draft when siteData changes (e.g. after reset)
  useEffect(() => { setDraft(siteData); }, [siteData]);

  const hasChanges = JSON.stringify(draft) !== JSON.stringify(siteData);

  const handlePublish = () => {
    updateSiteData(draft);
    toast.success('All changes published! The site is now updated.');
  };

  const handleDiscard = () => {
    if (confirm('Discard all unpublished changes?')) {
      setDraft(siteData);
      toast.info('Changes discarded');
    }
  };

  const handleLogout = () => { setAdminLoggedIn(false); navigate('/'); };

  const handleReset = () => {
    if (confirm('Reset all content to defaults? This cannot be undone.')) {
      resetToDefault();
      toast.success('All content reset to defaults');
    }
  };

  return (
    <DraftContext.Provider value={{ draft, setDraft, hasChanges }}>
      <div className="min-h-screen bg-secondary/30">
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <LayoutGrid className="h-5 w-5" />
              </div>
              <h1 className="font-display text-xl font-bold text-foreground">Admin Panel</h1>
              {hasChanges && (
                <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-0.5">
                  <AlertCircle className="h-3 w-3" /> Unsaved changes
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {hasChanges && (
                <Button variant="ghost" size="sm" onClick={handleDiscard} className="gap-1.5 text-muted-foreground">
                  Discard
                </Button>
              )}
              <Button
                size="sm"
                onClick={handlePublish}
                disabled={!hasChanges}
                className={`gap-1.5 font-semibold transition-all ${hasChanges ? 'bg-green-600 hover:bg-green-700 text-white shadow-md animate-pulse' : 'bg-primary hover:bg-primary/90'}`}
              >
                <CheckCircle className="h-4 w-4" /> Update
              </Button>
              <Button variant="outline" size="sm" asChild className="gap-1.5">
                <a href="/" target="_blank"><Eye className="h-4 w-4" /> View Site</a>
              </Button>
              <Button variant="outline" size="sm" onClick={handleReset} className="gap-1.5 text-destructive hover:text-destructive">
                <RotateCcw className="h-4 w-4" /> Reset
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1.5">
                <LogOut className="h-4 w-4" /> Logout
              </Button>
            </div>
          </div>
        </header>

        <main className="container py-8 max-w-4xl">
          <Tabs defaultValue="events" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 h-12">
              <TabsTrigger value="events" className="gap-1.5 text-xs sm:text-sm"><Calendar className="h-4 w-4 hidden sm:block" /> Events</TabsTrigger>
              <TabsTrigger value="programs" className="gap-1.5 text-xs sm:text-sm"><BookOpen className="h-4 w-4 hidden sm:block" /> Programs</TabsTrigger>
              <TabsTrigger value="event-sections" className="gap-1.5 text-xs sm:text-sm"><LayoutGrid className="h-4 w-4 hidden sm:block" /> Events Page</TabsTrigger>
              <TabsTrigger value="about" className="gap-1.5 text-xs sm:text-sm"><User className="h-4 w-4 hidden sm:block" /> About Page</TabsTrigger>
              <TabsTrigger value="settings" className="gap-1.5 text-xs sm:text-sm"><Lock className="h-4 w-4 hidden sm:block" /> Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="events"><UpcomingEventsEditor /></TabsContent>
            <TabsContent value="programs"><ProgramsEditor /></TabsContent>
            <TabsContent value="event-sections"><EventSectionsEditor /></TabsContent>
            <TabsContent value="about"><AboutPageEditor /></TabsContent>
            <TabsContent value="settings"><ChangeCredentialsSection /></TabsContent>
          </Tabs>
        </main>
      </div>
    </DraftContext.Provider>
  );
}

// ─── Main Admin Page ─────────────────────────────────────────────────
export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(isAdminLoggedIn());
  if (!isLoggedIn) return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
  return <AdminPanel />;
}
